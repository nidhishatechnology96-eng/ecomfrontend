// src/AdminPanel/AdminContext.jsx

import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
// ✅ Import your new API client
import apiClient from '../api'; 
// We still need these for Orders and Users until they are moved to the backend
import { db } from "../firebase"; 
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export const AdminContext = createContext();

export default function AdminProvider({ children }) {
    const { currentUser } = useContext(AuthContext);

    // STATE FOR RAW DATA
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // STATE FOR DERIVED DATA
    const [counts, setCounts] = useState({
        revenue: 0,
        ordersCompleted: 0,
        ordersPending: 0,
        users: 0,
    });

    // STATIC DATA
    const [categories, setCategories] = useState([
        "Dehydrated Vegetables", "Dehydrated Fruits", "Herbal Products", "Spices", "Water Bottles",
    ]);

    // FIRESTORE REFS (Only for Orders and Users now)
    const ordersCollectionRef = collection(db, "orders");
    const usersCollectionRef = collection(db, "users");

    // DATA FETCHING LOGIC
    const fetchData = useCallback(async () => {
        if (currentUser === undefined) return;
        
        setIsLoading(true);
        try {
            // ✅ Fetch all products FROM YOUR NEW BACKEND API
            const productsResponse = await apiClient.get('/api/products');
            setProducts(productsResponse.data);

            const isAdmin = currentUser && currentUser.email.endsWith('@admin.com');
            if (isAdmin) {
                // (Order and user fetching remains on Firebase for now)
                const ordersQuery = query(ordersCollectionRef, orderBy("createdAt", "desc"));
                const ordersData = await getDocs(ordersQuery);
                const fetchedOrders = ordersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setOrders(fetchedOrders);

                const usersData = await getDocs(usersCollectionRef);
                const fetchedUsers = usersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setUsers(fetchedUsers);

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
                setOrders([]);
                setUsers([]);
                setCounts({ revenue: 0, ordersCompleted: 0, ordersPending: 0, users: 0 });
            }
        } catch (err) {
            console.error("AdminContext: Error fetching data:", err);
            // If API fails, set products to empty array to avoid crashes
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // CRUD FUNCTIONS FOR PRODUCTS (NOW USING THE API)
    const addProduct = async (product) => {
        await apiClient.post('/api/products', product);
        fetchData(); // Refetch all data to update the UI
    };
    const updateProduct = async (productId, updatedProduct) => {
        await apiClient.put(`/api/products/${productId}`, updatedProduct);
        fetchData();
    };
    const deleteProduct = async (productId) => {
        await apiClient.delete(`/api/products/${productId}`);
        fetchData();
    };
    
    // OTHER FUNCTIONS (No changes needed for these)
    const addOrder = async (orderData) => { /* ...no change... */ };
    const fetchOrdersForUser = async (userId) => { /* ...no change... */ };
    const updateOrderStatus = async (orderId, status) => { /* ...no change... */ };
    const addCategory = (name) => { if (name && !categories.includes(name)) { setCategories([...categories, name]); return true; } return false; };
    const deleteCategory = (name) => setCategories(categories.filter(c => c !== name));
    const renameCategory = (oldName, newName) => setCategories(categories.map(c => (c === oldName ? newName : c)));

    return (
        <AdminContext.Provider value={{
            products,
            orders,
            categories,
            isLoading,
            counts,
            users,
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