import React, { useEffect, useState } from "react";
import './App.css';
import { fetchMenu, fetchOrders, placeOrder, submitFeedback } from './api';
import MoodSection from "./components/MoodSection";
import MenuSection from "./components/MenuSection";
import OrderSection from "./components/OrderSection";
import OrdersLive from "./components/OrdersLive";
import FeedbackSection from "./components/FeedbackSection";

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
    fetchMenuData();
    fetchOrdersData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setMenu(await fetchMenu());
    } catch {
      setError('Unable to load menu. Please try again later.');
    }
  };

  const fetchOrdersData = async () => {
    try {
      setOrders(await fetchOrders());
    } catch {
      setError('Unable to load orders. Please try again later.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder(orderForm);
      fetchOrdersData();
      setOrderForm({ customerName: '', tableNumber: '', items: [] });
      setLoyaltyPoints(prev => prev + 10);
    } catch {
      setError('Order failed. Please try again.');
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await submitFeedback(feedbackForm);
      setFeedbackForm({ customerName: '', rating: 5, comment: '' });
      alert('Thank you for your feedback!');
    } catch {
      setError('Feedback submission failed. Please try again.');
    }
  };

  return (
    <div className="App" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', margin: '2rem', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', color: '#ffcc70' }}>🍽️ SpicyByte Restaurant</h1>
      {error && <div style={{ color: '#f77' }}>{error}</div>}
      <MoodSection mood={mood} setMood={setMood} />
      <MenuSection menu={menu} mood={mood} orderForm={orderForm} setOrderForm={setOrderForm} />
      <OrderSection orderForm={orderForm} setOrderForm={setOrderForm} handlePlaceOrder={handlePlaceOrder} loyaltyPoints={loyaltyPoints} />
      <OrdersLive orders={orders} />
      <FeedbackSection feedbackForm={feedbackForm} setFeedbackForm={setFeedbackForm} handleFeedbackSubmit={handleFeedbackSubmit} />
    </div>
  );
}

export default App;
