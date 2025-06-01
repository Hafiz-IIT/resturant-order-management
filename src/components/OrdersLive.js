import React from "react";

export default function OrdersLive({ orders }) {
  return (
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
  );
}
