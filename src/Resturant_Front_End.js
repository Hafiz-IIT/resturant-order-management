// Restaurant Front End - React Component (Submission-friendly, ready to run in Create React App)
// To use: Paste this into App.js of a React project, install axios (`npm install axios`), and add styles as needed.

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './App.css'; // Uncomment if you add styles

const API_BASE = 'https://restaurant-backend.onrender.com';

function App() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderForm, setOrderForm] = useState({ customerName: '', tableNumber: '', items: [] });
  const [mood, setMood] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({ customerName: '', rating: 5, comment: '' });
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2100&q=80')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.color = '#fff';
    document.body.style.fontFamily = 'Poppins, sans-serif';
    fetchMenu();
    fetchOrders();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/menu`);
      setMenu(res.data);
    } catch (error) {
      setError('Unable to load menu. Please try again later.');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders`);
      setOrders(res.data);
    } catch (error) {
      setError('Unable to load orders. Please try again later.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axios.post(`${API_BASE}/api/orders`, orderForm);
      fetchOrders();
      setOrderForm({ customerName: '', tableNumber: '', items: [] });
      setLoyaltyPoints(prev => prev + 10);
    } catch (error) {
      setError('Order failed. Please try again.');
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post(`${API_BASE}/api/feedback`, feedbackForm);
      setFeedbackForm({ customerName: '', rating: 5, comment: '' });
      alert('Thank you for your feedback!');
    } catch (error) {
      setError('Feedback submission failed. Please try again.');
    }
  };

  const moodTags = {
    happy: ['Ice Cream', 'Burger'],
    tired: ['Coffee', 'Pasta'],
    romantic: ['Pizza', 'Wine'],
    studying: ['Tea', 'Wrap'],
  };

  return (
    <div className="App" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', margin: '2rem', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', color: '#ffcc70' }}>🍽️ SpicyByte Restaurant</h1>
      {error && <div style={{ color: '#f77' }}>{error}</div>}

      {/* Mood Section */}
      <section>
        <h2>🌈 What's your mood?</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {Object.keys(moodTags).map(tag => (
            <button
              key={tag}
              style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: '#ff6f61', color: '#fff', border: 'none', cursor: 'pointer' }}
              onClick={() => setMood(tag)}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Section */}
      <section>
        <h2>📋 Menu {mood && `for ${mood.charAt(0).toUpperCase() + mood.slice(1)} Mood`}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {menu
            .filter(item => (
              mood ? moodTags[mood].some(tag => item.name.toLowerCase().includes(tag.toLowerCase())) : true
            ))
            .map(item => (
              <div key={item._id} style={{ backgroundColor: '#fff1', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                <h3 style={{ color: '#ffdd99' }}>{item.name}</h3>
                <p>{item.category} | ₹{item.price}</p>
                <small>{item.tags?.join(', ')}</small>
                <button
                  style={{ marginTop: '0.5rem', padding: '0.3rem 0.7rem', backgroundColor: '#ffcc70', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => {
                    const exists = orderForm.items.find(i => i.name === item.name);
                    if (!exists) {
                      setOrderForm(prev => ({
                        ...prev,
                        items: [...prev.items, { name: item.name, quantity: 1 }]
                      }));
                    }
                  }}
                >➕ Add</button>
              </div>
            ))}
        </div>
      </section>

      {/* Order Section */}
      <section>
        <h2>📝 Place Order</h2>
        <input type="text" placeholder="Customer Name" value={orderForm.customerName} onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} />
        <input type="number" placeholder="Table Number" value={orderForm.tableNumber} onChange={e => setOrderForm({ ...orderForm, tableNumber: e.target.value })} />
        <ul>
          {orderForm.items.map((i, idx) => (
            <li key={idx}>{i.name} x {i.quantity}</li>
          ))}
        </ul>
        <button onClick={handlePlaceOrder}>🚀 Submit Order</button>
        <p>✨ Loyalty Points Earned: {loyaltyPoints}</p>
      </section>

      {/* Live Orders */}
      <section>
        <h2>📦 Live Orders</h2>
        <div>
          {orders.map(order => (
            <div key={order._id} style={{ backgroundColor: '#3338', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <strong>#{order._id.slice(-5)}</strong>
              <p>{order.customerName} @ Table {order.tableNumber}</p>
              <p>Status: {order.status}</p>
              <small>{order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}</small>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section>
        <h2>💬 Leave Feedback</h2>
        <input type="text" placeholder="Your Name" value={feedbackForm.customerName} onChange={e => setFeedbackForm({ ...feedbackForm, customerName: e.target.value })} />
        <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={feedbackForm.rating} onChange={e => setFeedbackForm({ ...feedbackForm, rating: e.target.value })} />
        <textarea placeholder="Comment" value={feedbackForm.comment} onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })} />
        <button onClick={handleFeedbackSubmit}>📨 Submit Feedback</button>
      </section>
    </div>
  );
}

export default App;
