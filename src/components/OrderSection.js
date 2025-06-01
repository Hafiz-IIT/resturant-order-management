import React from "react";

export default function OrderSection({ orderForm, setOrderForm, handlePlaceOrder, loyaltyPoints }) {
  return (
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
  );
}
