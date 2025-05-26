import { useState, useEffect } from 'react'
import './App.css'

// Set your backend base URL here
const BACKEND_BASE = "https://your-backend.onrender.com/api/customers";

// Example usage:
// fetch(`${BACKEND_BASE}`)
// fetch(`${BACKEND_BASE}/due`)
// fetch(`${BACKEND_BASE}/${id}`)
// fetch(`${BACKEND_BASE}/${id}/terminate`)
// fetch(`${BACKEND_BASE}/${id}/services`)

function CustomerForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '',
    city: '',
    address: '',
    contact: '',
    reminder: '',
    reminderType: '6months',
    active: true,
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleReminderType = e => {
    const today = new Date()
    let reminderDate = new Date(today)
    if (e.target.value === '6months') {
      reminderDate.setMonth(reminderDate.getMonth() + 6)
    } else {
      reminderDate.setFullYear(reminderDate.getFullYear() + 1)
    }
    // Ensure reminder is never today
    if (reminderDate.toISOString().slice(0, 10) === today.toISOString().slice(0, 10)) {
      // Add 1 day if it matches today (edge case)
      reminderDate.setDate(reminderDate.getDate() + 1)
    }
    setForm({ ...form, reminderType: e.target.value, reminder: reminderDate.toISOString().slice(0, 10) })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.contact || !form.city || !form.reminder || !form.address) return
    onAdd(form)
    setForm({ name: '', city: '', address: '', contact: '', reminder: '', reminderType: '6months', active: true })
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
      <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Number" required />
      <div className="reminder-row">
        <label>Reminder:</label>
        <select name="reminderType" value={form.reminderType} onChange={handleReminderType}>
          <option value="6months">6 Months</option>
          <option value="1year">1 Year</option>
        </select>
        <input name="reminder" value={form.reminder} onChange={handleChange} type="date" required />
      </div>
      <button type="submit">Add Customer</button>
    </form>
  )
}

function ProfileModal({ customer, onClose, onAddService }) {
  if (!customer) {
    return (
      <div className="profile-modal-overlay" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
        <div className="profile-modal" style={{width: '98vw', maxWidth: 700, maxHeight: '96vh', overflowY: 'auto', margin: 0, borderRadius: 18, background: '#f8fafc', boxShadow: '0 4px 32px rgba(0,0,0,0.18)', padding: 36, position: 'relative', fontFamily: 'Segoe UI, Arial, sans-serif'}}>
          <button className="close-btn" onClick={onClose} style={{position: 'absolute', top: 18, right: 28, fontSize: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#222', fontWeight: 600}} title="Close">×</button>
          <h2 style={{marginTop: 0, marginBottom: 24, textAlign: 'center', color: '#1a365d', letterSpacing: 1}}>Customer Not Found</h2>
          <div style={{textAlign: 'center', color: '#b71c1c', marginBottom: 24}}>This customer record no longer exists.</div>
        </div>
      </div>
    )
  }

  const [service, setService] = useState({ date: '', details: '', purifier: '', issue: '', parts: '', paymentMode: 'cash', amount: '' })
  // Handle delete service
  const handleDeleteService = (deleteIdx) => {
    const updatedServices = (customer.services || []).filter((_, idx) => idx !== deleteIdx)
    // Pass a special object to signal delete
    onAddService({ delete: true, updatedServices })
  }

  return (
    <div className="profile-modal-overlay" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div className="profile-modal" style={{width: '98vw', maxWidth: 700, maxHeight: '96vh', overflowY: 'auto', margin: 0, borderRadius: 18, background: '#f8fafc', boxShadow: '0 4px 32px rgba(0,0,0,0.18)', padding: 36, position: 'relative', fontFamily: 'Segoe UI, Arial, sans-serif'}}>
        <button className="close-btn" onClick={onClose} style={{position: 'absolute', top: 18, right: 28, fontSize: 36, background: 'none', border: 'none', cursor: 'pointer', color: '#222', fontWeight: 600}} title="Close">×</button>
        <h2 style={{marginTop: 0, marginBottom: 24, textAlign: 'center', color: '#1a365d', letterSpacing: 1}}>Customer Service Data</h2>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px', marginBottom: 18, alignItems: 'center', fontSize: 17}}>
          <div style={{gridColumn: '1 / span 2', display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 6}}>
            <div><b>Name:</b> <span style={{marginLeft: 6, color: '#222'}}>{customer.name}</span></div>
            <div><b>City:</b> <span style={{marginLeft: 6, color: '#222'}}>{customer.city}</span></div>
          </div>
          <div style={{gridColumn: '1 / span 2', display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 6}}>
            <div><b>Address:</b> <span style={{marginLeft: 6, color: '#222'}}>{customer.address}</span></div>
          </div>
          <div style={{gridColumn: '1 / span 2', display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 6}}>
            <div><b>Contact:</b> <span style={{marginLeft: 6, color: '#222'}}>{customer.contact}</span></div>
            <div><b>Reminder:</b> <span style={{marginLeft: 6, color: '#222'}}>{customer.reminder}</span></div>
          </div>
          {customer.services && customer.services.length > 0 && (
            <div style={{gridColumn: '1 / span 2', marginTop: 6, textAlign: 'center'}}><b>Last Service Date:</b> <span style={{marginLeft: 6, color: '#222'}}>{customer.services[customer.services.length-1].date}</span></div>
          )}
        </div>
        <h3 style={{marginTop: 0, marginBottom: 12, color: '#1a365d'}}>Service History</h3>
        <ul className="service-list" style={{marginBottom: 28, paddingLeft: 18, fontSize: 16, color: '#333'}}>
          {(customer.services || []).length === 0 && <li style={{color: '#888'}}>No service records yet.</li>}
          {(customer.services || []).map((s, i) => (
            <li key={i} style={{marginBottom: 8, lineHeight: 1.7, background: '#e6f0fa', borderRadius: 6, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span>
                <b>Date:</b> <span style={{marginRight: 8}}>{s.date}</span>
                <b>Service:</b> <span style={{marginRight: 8}}>{s.details}</span>
                <b>Purifier:</b> <span style={{marginRight: 8}}>{s.purifier}</span>
                {s.issue && <span><b>Issue:</b> <span style={{marginRight: 8}}>{s.issue}</span></span>}
                {s.parts && <span><b>Parts:</b> <span style={{marginRight: 8}}>{s.parts}</span></span>}
                {s.paymentMode && <span><b>Payment:</b> <span style={{marginRight: 8}}>{s.paymentMode.charAt(0).toUpperCase() + s.paymentMode.slice(1)}</span></span>}
                {s.amount && <span><b>Amount:</b> ₹{s.amount}</span>}
              </span>
              <button onClick={() => handleDeleteService(i)} style={{marginLeft: 16, background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontWeight: 500}}>Delete</button>
            </li>
          ))}
        </ul>
        <form className="service-form" onSubmit={e => {
          e.preventDefault()
          if (!service.date || !service.details || !service.purifier) return
          onAddService(service)
          setService({ date: '', details: '', purifier: '', issue: '', parts: '', paymentMode: 'cash', amount: '' })
        }} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'center', background: '#f1f5fb', borderRadius: 10, padding: 18, marginBottom: 0}}>
          <h4 style={{gridColumn: '1 / -1', margin: 0, color: '#1a365d'}}>Add Service</h4>
          <label style={{fontWeight: 500}}>Date<input type="date" value={service.date} onChange={e => setService(s => ({ ...s, date: e.target.value }))} required style={{marginLeft: 8, width: '90%'}} /></label>
          <label style={{fontWeight: 500}}>Service Details<input type="text" placeholder="Service Details" value={service.details} onChange={e => setService(s => ({ ...s, details: e.target.value }))} required style={{marginLeft: 8, width: '90%'}} /></label>
          <label style={{fontWeight: 500}}>Purifier Used<input type="text" placeholder="Purifier Used" value={service.purifier} onChange={e => setService(s => ({ ...s, purifier: e.target.value }))} required style={{marginLeft: 8, width: '90%'}} /></label>
          <label style={{fontWeight: 500}}>Purifier Issue<input type="text" placeholder="Purifier Issue" value={service.issue} onChange={e => setService(s => ({ ...s, issue: e.target.value }))} style={{marginLeft: 8, width: '90%'}} /></label>
          <label style={{fontWeight: 500}}>Purifier Parts<input type="text" placeholder="Purifier Parts" value={service.parts} onChange={e => setService(s => ({ ...s, parts: e.target.value }))} style={{marginLeft: 8, width: '90%'}} /></label>
          <label style={{fontWeight: 500}}>Payment Mode<select value={service.paymentMode} onChange={e => setService(s => ({ ...s, paymentMode: e.target.value }))} required style={{marginLeft: 8, width: '92%'}}>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
          </select></label>
          <label style={{fontWeight: 500}}>Amount Paid<input type="number" min="0" step="0.01" placeholder="Amount Paid" value={service.amount} onChange={e => setService(s => ({ ...s, amount: e.target.value }))} required style={{marginLeft: 8, width: '90%'}} /></label>
          <button type="submit" style={{gridColumn: '1 / -1', marginTop: 8, background: '#1a365d', color: '#fff', fontWeight: 600, fontSize: 18, border: 'none', borderRadius: 6, padding: '10px 0', letterSpacing: 1, cursor: 'pointer'}}>Add Service</button>
        </form>
      </div>
    </div>
  )
}

function CustomerList({ customers, onEdit, onTerminate, onDelete, onProfile }) {
  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>Name</th><th>City</th><th>Address</th><th>Contact</th><th>Reminder</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c, i) => (
          <tr key={i} className={!c.active ? 'terminated' : ''}>
            <td>
              <span className="profile-link" onClick={() => onProfile(c._id || c.id)}>{c.name}</span>
            </td>
            <td>{c.city}</td>
            <td>{c.address}</td>
            <td>{c.contact}</td>
            <td>{c.reminder}</td>
            <td>{c.active ? 'Active' : 'Terminated'}</td>
            <td style={{minWidth: 180, position: 'relative', zIndex: 1}}>
              <button onClick={() => onEdit(i)}>Edit</button>
              {c.active && <button onClick={() => onTerminate(i)} style={{marginLeft: 6}}>Terminate</button>}
              <button style={{marginLeft: 8, background: '#e53e3e', color: '#fff', position: 'relative', zIndex: 2}} onClick={() => onDelete(i)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CustomerFilter({ filter, setFilter }) {
  return (
    <div className="filter-row">
      <input placeholder="Filter by Address" value={filter.address} onChange={e => setFilter(f => ({ ...f, address: e.target.value }))} />
      <input placeholder="Filter by Phone Number" value={filter.contact} onChange={e => setFilter(f => ({ ...f, contact: e.target.value }))} />
      <input placeholder="Filter by Date" type="date" value={filter.reminder} onChange={e => setFilter(f => ({ ...f, reminder: e.target.value }))} />
    </div>
  )
}

function DueList({ customers, dueCustomers, onProfile }) {
  const list = dueCustomers && dueCustomers.length > 0 ? dueCustomers : customers.filter(c => {
    const today = new Date().toISOString().slice(0, 10)
    return c.active && c.reminder === today && (c.reminderType === '6months' || c.reminderType === '1year')
  })
  if (list.length === 0) {
    return <div className="due-list-empty">No service due today.</div>
  }
  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>Name</th><th>City</th><th>Address</th><th>Contact</th><th>Reminder</th><th>Profile</th>
        </tr>
      </thead>
      <tbody>
        {list.map((c) => (
          <tr key={c._id || c.id}>
            <td><span className="profile-link" onClick={() => onProfile(c._id || c.id)}>{c.name}</span></td>
            <td>{c.city}</td>
            <td>{c.address}</td>
            <td>{c.contact}</td>
            <td>{c.reminder}</td>
            <td><button onClick={() => onProfile(c._id || c.id)}>View</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [customers, setCustomers] = useState([])
  const [filter, setFilter] = useState({ address: '', contact: '', reminder: '' })
  const [editIndex, setEditIndex] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [activeTab, setActiveTab] = useState('add')
  const [reminderPopup, setReminderPopup] = useState(null)
  const [profileId, setProfileId] = useState(null)

  // Hardcoded owner credentials (replace with secure backend in production)
  const OWNER_USERNAME = 'owner'
  const OWNER_PASSWORD = 'mkl@2025'

  useEffect(() => {
    if (!isLoggedIn) {
      document.body.classList.add('frontpage-bg')
    } else {
      document.body.classList.remove('frontpage-bg')
    }
    return () => {
      document.body.classList.remove('frontpage-bg')
    }
  }, [isLoggedIn])

  // Fetch customers from backend API after login and after any change
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE}`)
      if (!res.ok) throw new Error('Failed to fetch customers')
      const data = await res.json()
      setCustomers(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${BACKEND_BASE}`)
        .then(res => res.json())
        .then(data => setCustomers(data))
        .catch(() => setCustomers([]));
    }
  }, [isLoggedIn])

  // Fetch due reminders from backend (optional, if backend supports it)
  const [dueCustomers, setDueCustomers] = useState([])
  useEffect(() => {
    if (isLoggedIn && activeTab === 'due') {
      fetch('http://localhost:5000/api/customers/due')
        .then(res => res.json())
        .then(data => setDueCustomers(data))
        .catch(err => console.error('Failed to fetch due reminders:', err))
    }
  }, [isLoggedIn, activeTab])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Only the owner can login.')
    }
  }

  // Add customer to backend
  const handleAddCustomer = async (customer) => {
    try {
      const res = await fetch(`${BACKEND_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      })
      if (!res.ok) throw new Error('Failed to add customer')
      await fetchCustomers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    setEditForm({ ...customers[index] })
  }

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  // Edit customer in backend
  const handleEditSave = async (e) => {
    e.preventDefault()
    try {
      const id = customers[editIndex]._id || customers[editIndex].id // adjust for your backend
      const res = await fetch(`${BACKEND_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error('Failed to update customer')
      await fetchCustomers()
      setEditIndex(null)
      setEditForm(null)
    } catch (err) {
      console.error(err)
    }
  }

  // Terminate customer in backend
  const handleTerminate = async (index) => {
    try {
      const id = customers[index]._id || customers[index].id // adjust for your backend
      const res = await fetch(`http://localhost:5000/api/customers/${id}/terminate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: false }),
      })
      if (!res.ok) throw new Error('Failed to terminate customer')
      await fetchCustomers()
    } catch (err) {
      console.error(err)
    }
  }

  // Delete customer in backend
  const handleDeleteCustomer = async (index) => {
    try {
      const id = customers[index]._id || customers[index].id;
      const res = await fetch(`${BACKEND_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete customer');
      await fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  // Add service to backend for a customer
  const handleAddService = async (service) => {
    try {
      const customer = customers.find(c => (c._id || c.id) === profileId);
      if (!customer) return;
      const id = customer._id || customer.id;
      // If deleting a service
      if (service && service.delete && Array.isArray(service.updatedServices)) {
        const res = await fetch(`http://localhost:5000/api/customers/${id}/services`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ services: service.updatedServices }),
        })
        if (!res.ok) throw new Error('Failed to update service history')
        await fetchCustomers()
        return
      }
      // Add a new service
      const res = await fetch(`http://localhost:5000/api/customers/${id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })
      if (!res.ok) throw new Error('Failed to add service')
      await fetchCustomers()
    } catch (err) {
      console.error(err)
    }
  }

  // Reminder popup logic
  function checkReminders(list) {
    setReminderPopup(null)
  }

  // Filtered customers for list
  const filteredCustomers = customers.filter(c =>
    (!filter.address || (c.address && c.address.toLowerCase().includes(filter.address.toLowerCase()))) &&
    (!filter.contact || c.contact.includes(filter.contact)) &&
    (!filter.reminder || (c.reminder && c.reminder === filter.reminder))
  )

  if (!isLoggedIn) {
    return (
      <>
        <img src="/image.png" alt="MKL Logo" style={{position: 'fixed', top: 12, left: 24, width: 160, height: 'auto', zIndex: 10, background: 'none', border: 'none', boxShadow: 'none', borderRadius: 0}} />
        <div className="login-container">
          <h2>MKL ENTERPRISES</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Owner Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            {loginError && <div className="error">{loginError}</div>}
          </form>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="background-drink-rent" />
      {profileId !== null && (
        <ProfileModal
          customer={customers.find(c => (c._id || c.id) === profileId)}
          onClose={() => setProfileId(null)}
          onAddService={handleAddService}
        />
      )}
      <div className="crm-dashboard full-width">
        <header>
          <div />
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </header>
        <main>
          <h2>Welcome, Owner!</h2>
          <div className="crm-tabs">
            <button className={activeTab === 'add' ? 'active' : ''} onClick={() => setActiveTab('add')}>Add Customer</button>
            <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}>Customer List & Filter</button>
            <button className={activeTab === 'due' ? 'active' : ''} onClick={() => setActiveTab('due')}>Reminders</button>
          </div>
          {activeTab === 'add' && (
            <section className="crm-section">
              <h3>Add Customer</h3>
              <CustomerForm onAdd={handleAddCustomer} />
            </section>
          )}
          {activeTab === 'list' && (
            <section className="crm-section full-screen-section">
              <h3>Customer List & Filter</h3>
              <CustomerFilter filter={filter} setFilter={setFilter} />
              <CustomerList customers={filteredCustomers} onEdit={handleEdit} onTerminate={handleTerminate} onDelete={handleDeleteCustomer} onProfile={setProfileId} />
            </section>
          )}
          {activeTab === 'due' && (
            <section className="crm-section full-screen-section">
              <h3>Reminders</h3>
              <DueList customers={customers} dueCustomers={dueCustomers} onProfile={setProfileId} />
            </section>
          )}
          {editIndex !== null && (
            <section className="crm-section">
              <h3>Edit Customer</h3>
              <form className="customer-form" onSubmit={handleEditSave}>
                <input name="name" value={editForm.name} onChange={handleEditChange} required />
                <input name="city" value={editForm.city} onChange={handleEditChange} required />
                <input name="address" value={editForm.address} onChange={handleEditChange} required />
                <input name="contact" value={editForm.contact} onChange={handleEditChange} required />
                <div className="reminder-row">
                  <label>Reminder:</label>
                  <select name="reminderType" value={editForm.reminderType || '6months'} onChange={e => {
                    const today = new Date()
                    let reminderDate = new Date(today)
                    if (e.target.value === '6months') {
                      reminderDate.setMonth(reminderDate.getMonth() + 6)
                    } else {
                      reminderDate.setFullYear(reminderDate.getFullYear() + 1)
                    }
                    // Ensure reminder is never today
                    if (reminderDate.toISOString().slice(0, 10) === today.toISOString().slice(0, 10)) {
                      reminderDate.setDate(reminderDate.getDate() + 1)
                    }
                    setEditForm({ ...editForm, reminderType: e.target.value, reminder: reminderDate.toISOString().slice(0, 10) })
                  }}>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                  <input name="reminder" value={editForm.reminder} onChange={handleEditChange} type="date" required />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditIndex(null)}>Cancel</button>
              </form>
            </section>
          )}
        </main>
      </div>
    </>
  )
}

export default App
