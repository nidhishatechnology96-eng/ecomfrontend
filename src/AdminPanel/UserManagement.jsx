import React, { useState, useMemo } from 'react';
// We are temporarily removing useContext to make this component self-contained.
// import { AdminContext } from './AdminContext'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- SAMPLE DATA ---
// We add this so the component has some data to show on load.
const sampleUsers = [
  { id: '1678886400001', name: 'John Doe', role: 'Customer' },
  { id: '1678886400002', name: 'Jane Smith', role: 'Admin' },
  { id: '1678886400003', name: 'Peter Jones', role: 'Customer' },
];

function UserManagement() {
  // --- STATE MANAGEMENT FIX ---
  // Instead of getting users from context, we manage them locally with useState.
  // This GUARANTEES that add, update, and delete will work inside this component.
  const [users, setUsers] = useState(sampleUsers);
  // const { users, setUsers } = useContext(AdminContext); // You can switch back to this later

  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ name: '', role: 'Customer' });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // These functions now reliably update the local `users` state.
  const addUser = (user) => {
    setUsers(prev => [...prev, { ...user, id: Date.now().toString() }]);
  };
  const updateUser = (id, updatedUser) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updatedUser } : u)));
  };
  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };
  
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    );
  }, [users, query]);

  // This handleSubmit function will now work correctly every time.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      updateUser(editingId, form);
      showAlert(`User "${form.name}" has been updated.`, 'success');
    } else {
      addUser(form);
      showAlert(`User "${form.name}" has been added.`, 'success');
    }
    
    cancelEdit();
  };

  const handleEdit = (user) => {
    window.scrollTo(0, 0);
    setEditingId(user.id);
    setForm({ name: user.name, role: user.role });
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUser(user.id);
      showAlert(`User "${user.name}" has been deleted.`, 'danger');
    }
  };

  const handlePromote = (user) => {
    if (window.confirm(`Promote ${user.name} to Admin?`)) {
        updateUser(user.id, { ...user, role: 'Admin' });
        showAlert(`${user.name} is now an Admin.`, 'info');
    }
  }

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', role: 'Customer' });
  }

  // The rest of the JSX is already responsive and correct. No changes needed below.
  return (
    <>
      {alert.show && <div className={`alert alert-${alert.type} position-fixed top-0 end-0 m-3`} style={{ zIndex: 1050 }}>{alert.message}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 fw-bold text-primary">{editingId ? 'Edit User' : 'Add New User'}</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-5">
                <input id="userName" type="text" className="form-control" placeholder="User Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-12 col-md-4">
                <select id="userRole" className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="col-12 col-md-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Add'}</button>
                {editingId && <button type="button" className="btn btn-secondary w-100" onClick={cancelEdit}>Cancel</button>}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header py-3">
          <input type="text" className="form-control" placeholder="Search by name or role..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className='table-dark'>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id.slice(-6)}</td> {/* Show shorter ID */}
                      <td className='fw-bold'>{user.name}</td>
                      <td><span className={`badge fs-6 ${user.role === 'Admin' ? 'bg-primary' : 'bg-secondary'}`}>{user.role}</span></td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-2 mb-1" title="Edit" onClick={() => handleEdit(user)}><i className="bi bi-pencil-square"></i></button>
                        <button className="btn btn-sm btn-outline-danger me-2 mb-1" title="Delete" onClick={() => handleDelete(user)}><i className="bi bi-trash"></i></button>
                        {user.role === 'Customer' && <button className="btn btn-sm btn-outline-success mb-1" title="Promote to Admin" onClick={() => handlePromote(user)}><i className="bi bi-arrow-up-circle"></i></button>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center p-4">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserManagement;