import React, { useState } from 'react';

// --- THE FIX ---
// We now accept `isProcessing` and `error` as props to get real-time status from the parent.
function PaymentStep({ onPaymentSubmit, onBack, isProcessing, error }) {
    const [selectedMethod, setSelectedMethod] = useState('cod'); // Default to 'cod' for better initial view
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '', expiry: '', cvc: '', upiId: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (selectedMethod === 'card') {
            if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Valid 16-digit card number is required.';
            if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(paymentDetails.expiry)) newErrors.expiry = 'Use MM/YY format.';
            if (!/^\d{3,4}$/.test(paymentDetails.cvc)) newErrors.cvc = 'Valid CVC is required.';
        } else if (selectedMethod === 'upi') {
            if (!/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) newErrors.upiId = 'Valid UPI ID is required (e.g., yourname@bank).';
        }
        return newErrors;
    };

    const handleSubmit = () => {
        if (selectedMethod === 'cod') {
            onPaymentSubmit({ method: 'Cash on Delivery', details: null });
            return;
        }

        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            onPaymentSubmit({ method: selectedMethod, details: paymentDetails });
        }
    };

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
        setErrors({}); 
    };
    
    // ... renderPaymentDetails function (no changes needed here) ...
    const renderPaymentDetails = () => {
        switch (selectedMethod) {
            case 'card':
                return (
                    <div>
                        <h5 className="mb-3">Enter Card Details</h5>
                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="cardNumber" className="form-label">Card Number</label>
                                <input id="cardNumber" name="cardNumber" className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`} placeholder="0000 0000 0000 0000" value={paymentDetails.cardNumber} onChange={handleChange} />
                                {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="expiry" className="form-label">Expiry Date</label>
                                <input id="expiry" name="expiry" className={`form-control ${errors.expiry ? 'is-invalid' : ''}`} placeholder="MM/YY" value={paymentDetails.expiry} onChange={handleChange} />
                                {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="cvc" className="form-label">CVC</label>
                                <input id="cvc" name="cvc" className={`form-control ${errors.cvc ? 'is-invalid' : ''}`} placeholder="123" value={paymentDetails.cvc} onChange={handleChange} />
                                {errors.cvc && <div className="invalid-feedback">{errors.cvc}</div>}
                            </div>
                        </div>
                    </div>
                );
            case 'upi':
                return (
                    <div>
                        <h5 className="mb-3">Scan QR or Enter UPI ID</h5>
                        <div className="text-center my-3 p-3 bg-light rounded">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=example@upi" alt="UPI QR Code" className="img-fluid" />
                        </div>
                        <label htmlFor="upiId" className="form-label">Your UPI ID</label>
                        <input id="upiId" name="upiId" className={`form-control ${errors.upiId ? 'is-invalid' : ''}`} placeholder="yourname@bank" value={paymentDetails.upiId} onChange={handleChange} />
                        {errors.upiId && <div className="invalid-feedback">{errors.upiId}</div>}
                    </div>
                );
            case 'cod':
                return (
                    <div className="text-center p-3 bg-light rounded">
                        <i className="bi bi-cash-coin fs-1 text-success mb-2"></i>
                        <h5>Cash on Delivery</h5>
                        <p className="text-muted mb-0">You will pay for your order upon its delivery.</p>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="card shadow-sm p-4 p-md-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 className="mb-4 text-center">Choose Payment Method</h3>
            <div className="d-grid gap-2 mb-4">
                <div className="btn-group" role="group">
                    <button type="button" className={`btn ${selectedMethod === 'card' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleMethodChange('card')}><i className="bi bi-credit-card-fill me-2"></i>Credit/Debit Card</button>
                    <button type="button" className={`btn ${selectedMethod === 'upi' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleMethodChange('upi')}><i className="bi bi-qr-code me-2"></i>UPI / QR</button>
                    <button type="button" className={`btn ${selectedMethod === 'cod' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleMethodChange('cod')}><i className="bi bi-truck me-2"></i>Cash on Delivery</button>
                </div>
            </div>

            <div className="payment-details mb-4">
                {renderPaymentDetails()}
            </div>
            
            {/* --- THIS IS THE UPDATED SECTION --- */}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex flex-column-reverse flex-sm-row justify-content-between gap-3 mt-3">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={onBack} disabled={isProcessing}>
                    <i className="bi bi-arrow-left me-1"></i>Back to Address
                </button>
                <button className="btn btn-success btn-lg w-100" onClick={handleSubmit} disabled={isProcessing}>
                    {isProcessing ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</>
                    ) : (
                        selectedMethod === 'cod' ? <><i className="bi bi-bag-check-fill me-2"></i>Place Order</> : 'Confirm and Pay'
                    )}
                </button>
            </div>
            {/* --- END OF UPDATED SECTION --- */}
        </div>
    );
}

export default PaymentStep;