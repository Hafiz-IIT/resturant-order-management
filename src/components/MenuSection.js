import React from "react";
import { moodTags } from "./MoodSection";

export default function MenuSection({ menu, mood, orderForm, setOrderForm }) {
  return (
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
  );
}
