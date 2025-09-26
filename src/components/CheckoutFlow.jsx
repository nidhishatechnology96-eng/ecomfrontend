import React, { useState, useCallback, useContext } from 'react';
import { serverTimestamp } from "firebase/firestore";
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';
import OrderConfirmation from './OrderConfirmation';
import { AdminContext } from '../AdminPanel/AdminContext';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const INITIAL_STATE = { address: {}, payment: null };

function CheckoutFlow() {
    // State for managing the multi-step flow
    const [currentStep, setCurrentStep] = useState('address');
    const [checkoutData, setCheckoutData] = useState(INITIAL_STATE);
    const [confirmedOrderDetails, setConfirmedOrderDetails] = useState(null);
    
    // State for handling async operations (loading spinners, errors)
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Contexts for data and actions
    const { addOrder } = useContext(AdminContext);
    const { currentUser } = useContext(AuthContext);
    const { cart, clearCart } = useContext(CartContext);

    // Calculate order totals
    const subtotal = cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const handleAddressSubmit = useCallback((address) => {
        setCheckoutData(prev => ({ ...prev, address }));
        setCurrentStep('payment');
    }, []);
    
    // --- THIS IS THE FINAL, ROBUST ORDER HANDLER ---
    const handlePlaceOrder = useCallback(async (paymentInfo) => {
        setIsProcessing(true);
        setError(null);

        // --- VALIDATION 1: Check if user is logged in ---
        if (!currentUser) {
            setError("You must be logged in to place an order.");
            setIsProcessing(false);
            return;
        }

        // --- VALIDATION 2: Check if address data exists ---
        if (!checkoutData.address || !checkoutData.address.fullName) {
             setError("Please complete the address form before proceeding.");
             setIsProcessing(false);
             return;
        }

        // Create the final order data object
        const finalOrderData = {
            userId: currentUser.uid,
            customerName: checkoutData.address.fullName,
            userEmail: currentUser.email,
            cart: cart.map(item => ({
                id: item.id || 'ID_MISSING',
                name: item.name || 'Product Name Missing',
                quantity: item.quantity || 1,
                price: item.price || 0
            })),
            totalAmount: total,
            address: checkoutData.address,
            paymentMethod: paymentInfo.method,
            createdAt: serverTimestamp(),
        };

        // --- BRANCH 1: Handle Cash on Delivery ---
        if (paymentInfo.method === 'Cash on Delivery') {
            try {
                const orderToSave = { ...finalOrderData, status: 'Pending' };
                const savedOrder = await addOrder(orderToSave);
                setConfirmedOrderDetails({ ...orderToSave, id: savedOrder.id });
                setCurrentStep('confirmation');
                clearCart();
            } catch (err) {
                console.error("COD Order Failed:", err);
                setError("There was an error placing your order. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        } 
        // --- BRANCH 2: Handle Online Payments (UPI/Card) ---
        else {
            try {
                // 1. Call your backend to create a Razorpay order
                const response = await fetch('http://localhost:5000/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total }),
                });

                if (!response.ok) throw new Error('Failed to create payment order on server.');
                const razorpayOrder = await response.json();

                // 2. Configure and open the Razorpay modal
                const options = {
                    key: 'YOUR_RAZORPAY_KEY_ID', // IMPORTANT: Replace with your actual key
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: 'HYJAIN Food Products',
                    description: 'Order Payment',
                    order_id: razorpayOrder.id,
                    handler: async function (razorpayResponse) {
                        // This function runs AFTER the user pays successfully
                        const orderToSave = {
                            ...finalOrderData,
                            status: 'Completed',
                            paymentId: razorpayResponse.razorpay_payment_id,
                            razorpayOrderId: razorpayResponse.razorpay_order_id,
                            paymentSignature: razorpayResponse.razorpay_signature,
                        };
                        
                        const savedOrder = await addOrder(orderToSave);
                        setConfirmedOrderDetails({ ...orderToSave, id: savedOrder.id });
                        setCurrentStep('confirmation');
                        clearCart();
                    },
                    prefill: {
                        name: checkoutData.address.fullName,
                        email: currentUser.email,
                        contact: checkoutData.address.phone,
                    },
                    theme: { color: '#198754' },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

                rzp.on('payment.failed', function (response) {
                    console.error("Razorpay Payment Failed:", response.error.description);
                    setError(`Payment failed: ${response.error.description}`);
                    setIsProcessing(false);
                });

            } catch (err) {
                console.error("Online Payment Flow Failed:", err);
                setError("Could not connect to the payment service. Please try again.");
                setIsProcessing(false);
            }
        }
    }, [addOrder, checkoutData.address, currentUser, cart, total, clearCart]);

    const handleBackToAddress = useCallback(() => setCurrentStep('address'), []);
    
    // Renders the correct step of the checkout process
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'address':
                return <AddressStep onAddressSubmit={handleAddressSubmit} />;
            case 'payment':
                return <PaymentStep onPaymentSubmit={handlePlaceOrder} onBack={handleBackToAddress} isProcessing={isProcessing} error={error} />;
            case 'confirmation':
                return <OrderConfirmation orderDetails={confirmedOrderDetails} />;
            default:
                return <AddressStep onAddressSubmit={handleAddressSubmit} />;
        }
    };

    return (
        <div className="container my-5">
             <div className="mt-5">
                {renderCurrentStep()}
            </div>
        </div>
    );
}

export default CheckoutFlow;