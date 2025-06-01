import React from "react";

const moodTags = {
  happy: ['Ice Cream', 'Burger'],
  tired: ['Coffee', 'Pasta'],
  romantic: ['Pizza', 'Wine'],
  studying: ['Tea', 'Wrap'],
};

export default function MoodSection({ mood, setMood }) {
  return (
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
  );
}

export { moodTags };
