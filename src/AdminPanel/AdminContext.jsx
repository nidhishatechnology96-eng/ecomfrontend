import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { db } from "../firebase"; // Make sure your firebase config is correctly exported from this file
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext"; // Assuming you have an AuthContext for the current user

// 1. CREATE THE CONTEXT
export const AdminContext = createContext();

// 2. CREATE THE PROVIDER COMPONENT
export default function AdminProvider({ children }) {
    const { currentUser } = useContext(AuthContext);

    // STATE FOR RAW DATA FETCHED FROM FIREBASE
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]); // Added state for users

    // STATE FOR DERIVED/CALCULATED DATA FOR THE REPORTS COMPONENT
    const [counts, setCounts] = useState({
        revenue: 0,
        ordersCompleted: 0,
        ordersPending: 0,
        users: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // STATIC DATA (can also be fetched from Firebase if needed)
    const [categories, setCategories] = useState([
        "Dehydrated Vegetables", "Dehydrated Fruits", "Herbal Products", "Spices", "Water Bottles",
    ]);

    // FIRESTORE COLLECTION REFERENCES
    const productsCollectionRef = collection(db, "products");
    const ordersCollectionRef = collection(db, "orders");
    const usersCollectionRef = collection(db, "users"); // Assumes you have a 'users' collection

    // 3. DATA FETCHING AND PROCESSING LOGIC
    const fetchData = useCallback(async () => {
        if (currentUser === undefined) {
            // If auth status is not determined yet, wait.
            return;
        }
        setIsLoading(true);
        try {
            // Fetch all products
            const productsData = await getDocs(productsCollectionRef);
            const fetchedProducts = productsData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(fetchedProducts);

            // Only fetch orders and users if the current user is an admin
            const isAdmin = currentUser && currentUser.email.endsWith('@admin.com');
            if (isAdmin) {
                // Fetch all orders, sorted by creation date
                const ordersQuery = query(ordersCollectionRef, orderBy("createdAt", "desc"));
                const ordersData = await getDocs(ordersQuery);
                const fetchedOrders = ordersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setOrders(fetchedOrders);

                // Fetch all users to get a total count
                const usersData = await getDocs(usersCollectionRef);
                const fetchedUsers = usersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setUsers(fetchedUsers);

                // --- DYNAMICALLY CALCULATE COUNTS FROM FETCHED DATA ---
                const totalRevenue = fetchedOrders
                    .filter(order => order.status === 'Completed')
                    .reduce((sum, order) => sum + (order.total || 0), 0);

                const completedOrders = fetchedOrders.filter(order => order.status === 'Completed').length;
                const pendingOrders = fetchedOrders.filter(order => order.status === 'Pending').length;

                setCounts({
                    revenue: totalRevenue,
                    ordersCompleted: completedOrders,
                    ordersPending: pendingOrders,
                    users: fetchedUsers.length,
                });

            } else {
                // If not an admin, clear the sensitive data
                setOrders([]);
                setUsers([]);
                setCounts({ revenue: 0, ordersCompleted: 0, ordersPending: 0, users: 0 });
            }
        } catch (err) {
            console.error("AdminContext: Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]); // Dependency on currentUser to refetch when auth state changes

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 4. CRUD AND OTHER HELPER FUNCTIONS (UNCHANGED)
    const addOrder = async (orderData) => {
        const docRef = await addDoc(ordersCollectionRef, { ...orderData, createdAt: new Date() });
        fetchData(); // Refetch to update stats
        return docRef;
    };

    const fetchOrdersForUser = async (userId) => {
        if (!userId) return [];
        const q = query(ordersCollectionRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };
    
    const updateOrderStatus = async (orderId, status) => {
        const orderDoc = doc(db, "orders", orderId);
        await updateDoc(orderDoc, { status });
        fetchData(); // Refetch to update stats
    };

    const addProduct = async (product) => { await addDoc(productsCollectionRef, product); fetchData(); };
    const updateProduct = async (productId, updatedProduct) => { await updateDoc(doc(db, "products", productId), updatedProduct); fetchData(); };
    const deleteProduct = async (productId) => { await deleteDoc(doc(db, "products", productId)); fetchData(); };
    const addCategory = (name) => { if (name && !categories.includes(name)) { setCategories([...categories, name]); return true; } return false; };
    const deleteCategory = (name) => setCategories(categories.filter(c => c !== name));
    const renameCategory = (oldName, newName) => setCategories(categories.map(c => (c === oldName ? newName : c)));

    // 5. PROVIDE THE VALUE TO CHILDREN
    // The value now includes the dynamically calculated 'counts' object
    return (
        <AdminContext.Provider value={{
            products,
            orders,
            categories,
            isLoading,
            counts, // <-- This is now available for the Reports component
            users, // <-- You can use this too if needed elsewhere
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            deleteCategory,
            renameCategory,
            addOrder,
            fetchOrdersForUser,
            updateOrderStatus
        }}>
            {children}
        </AdminContext.Provider>
    );
};