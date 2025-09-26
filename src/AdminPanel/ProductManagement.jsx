import React, { useContext, useState, useMemo } from 'react';
import { AdminContext } from './AdminContext';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ProductManagement() {
    const { products, addProduct, updateProduct, deleteProduct, categories } = useContext(AdminContext);

    const initialFormState = useMemo(() => ({
        name: "", price: "", quantity: "", description: "", category: categories[0] || ""
    }), [categories]);

    const [form, setForm] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [query, setQuery] = useState('');

    const filteredProducts = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return products;
        return products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.category && p.category.toLowerCase().includes(q))
        );
    }, [products, query]);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const resetForm = () => {
        setForm(initialFormState);
        setImageFile(null);
        setImagePreview("");
        setEditingId(null);
        const fileInput = document.getElementById('productImage');
        if (fileInput) fileInput.value = null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        // Start with the existing image URL if we are editing
        let imageUrl = editingId ? form.image : "";

        try {
            // If a new file has been selected, upload it
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await axios.post('http://localhost:5000/api/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = response.data.imageUrl; // The new URL from Cloudinary
            }

            // If there's still no image URL (e.g., adding a new product without an image)
            if (!imageUrl) {
                showAlert('Please select an image for the product.', 'danger');
                setIsUploading(false);
                return;
            }

            const productData = { ...form, price: Number(form.price), quantity: Number(form.quantity), image: imageUrl };

            if (editingId) {
                await updateProduct(editingId, productData);
                showAlert('Product updated successfully!');
            } else {
                await addProduct(productData);
                showAlert('Product added successfully!');
            }
            resetForm();
        } catch (error) {
            console.error("Error saving product:", error);
            showAlert('Failed to save product. The server might be down or the API endpoint is incorrect.', 'danger');
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (product) => {
        window.scrollTo(0, 0);
        setEditingId(product.id);
        // Include the existing image URL in the form state
        setForm({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
            category: product.category,
            image: product.image 
        });
        setImagePreview(product.image || "");
        setImageFile(null);
    };

    const handleDelete = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteProduct(productId);
            showAlert('Product deleted successfully!', 'danger');
        }
    };

    return (
        <>
            {alert.show && (
                <div className={`alert alert-${alert.type} position-fixed top-0 end-0 m-3 shadow`} style={{ zIndex: 1050 }}>
                    {alert.message}
                </div>
            )}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h3 className="card-title mb-4">{editingId ? 'Edit Product' : 'Add a New Product'}</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Form inputs... */}
                        <div className="row g-3 mb-3">
                            <div className="col-12 col-md-4"><label className="form-label">Product Name</label><input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required /></div>
                            <div className="col-12 col-md-4"><label className="form-label">Price</label><input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" /></div>
                            <div className="col-12 col-md-4"><label className="form-label">Quantity</label><input type="number" className="form-control" name="quantity" value={form.quantity} onChange={handleChange} required min="0" /></div>
                        </div>
                        <div className="mb-3"><label className="form-label">Description</label><textarea className="form-control" name="description" rows="3" value={form.description} onChange={handleChange} required></textarea></div>
                        <div className="row g-3 mb-3">
                            <div className="col-12 col-md-6"><label className="form-label">Category</label><select className="form-select" name="category" value={form.category} onChange={handleChange} required>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                            <div className="col-12 col-md-6"><label className="form-label">Product Image</label><input className="form-control" type="file" id="productImage" name="image" onChange={handleImageChange} accept="image/*" /></div>
                        </div>
                        {imagePreview && (<div className="mb-3"><p className="mb-1 small">Image Preview:</p><img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '150px' }} /></div>)}
                        <div className="d-flex flex-wrap gap-2">
                            <button type="submit" className="btn btn-primary" disabled={isUploading}>{isUploading ? 'Uploading...' : (editingId ? 'Update Product' : 'Add Product')}</button>
                            {editingId && (<button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel Edit</button>)}
                        </div>
                    </form>
                </div>
            </div>
            {/* Product table... */}
            <h3 className="mt-5 mb-3">All Products</h3>
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3"><input type="text" className="form-control" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped align-middle mb-0 product-table">
                            <thead className="table-dark">
                                <tr><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th><th>Category</th><th>Description</th><th className="text-center">Actions</th></tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(p => (
                                    <tr key={p.id}>
                                        <td data-label="Image"><img src={p.image || 'https://via.placeholder.com/60'} alt={p.name} className="img-fluid rounded" style={{ width: "60px", height: "60px", objectFit: "cover" }} /></td>
                                        <td data-label="Name" className="fw-bold">{p.name}</td>
                                        <td data-label="Price">₹{p.price}</td>
                                        <td data-label="Quantity">{p.quantity > 0 ? p.quantity : <span className="badge bg-danger">Out of Stock</span>}</td>
                                        <td data-label="Category">{p.category}</td>
                                        <td data-label="Description" className="description-cell">{p.description || 'N/A'}</td>
                                        <td data-label="Actions" className="text-center">
                                            <button className="btn btn-sm btn-outline-primary me-2 mb-1" title="Edit" onClick={() => handleEdit(p)}><i className="bi bi-pencil-fill"></i></button>
                                            <button className="btn btn-sm btn-outline-danger mb-1" title="Delete" onClick={() => handleDelete(p.id)}><i className="bi bi-trash-fill"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductManagement;