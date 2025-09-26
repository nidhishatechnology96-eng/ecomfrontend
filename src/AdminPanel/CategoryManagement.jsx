// CategoryManagement.jsx
import React, { useContext, useState, useMemo } from 'react';
import { AdminContext } from './AdminContext';

function CategoryManagement() {
  const { categories, addCategory, renameCategory, deleteCategory } = useContext(AdminContext);
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  }, [categories, query]);
  
  const showAlert = (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (editing) {
      renameCategory(editing, trimmedName);
      showAlert('Category updated successfully!');
    } else {
      if(addCategory(trimmedName)) {
        showAlert('Category added successfully!');
      } else {
        showAlert('Category already exists!');
      }
    }
    setName('');
    setEditing(null);
  };

  const handleEdit = (categoryName) => {
    setEditing(categoryName);
    setName(categoryName);
  };

  const handleDelete = (categoryName) => {
      if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
          deleteCategory(categoryName);
          showAlert('Category deleted!');
      }
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Category Management</h1>
      </div>

      {message && <div className="alert alert-success mb-3">{message}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3 align-items-center">
            <div className="col">
              <input 
                type="text" 
                className="form-control" 
                placeholder="New category name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                {editing ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-header py-3">
             <input 
                type="text" 
                className="form-control" 
                placeholder="Search categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
              />
        </div>
        <div className="card-body">
            <ul className="list-group list-group-flush">
                {filteredCategories.map(cat => (
                    <li key={cat} className="list-group-item d-flex justify-content-between align-items-center">
                        {cat}
                        <div>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(cat)}>
                                <i className="bi bi-pencil"></i> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat)}>
                                <i className="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </>
  );
}

export default CategoryManagement;
