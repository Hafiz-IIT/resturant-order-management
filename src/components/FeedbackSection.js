import React from "react";

export default function FeedbackSection({ feedbackForm, setFeedbackForm, handleFeedbackSubmit }) {
  return (
    <section>
      <h2>💬 Leave Feedback</h2>
      <input type="text" placeholder="Your Name" value={feedbackForm.customerName} onChange={e => setFeedbackForm({ ...feedbackForm, customerName: e.target.value })} />
      <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={feedbackForm.rating} onChange={e => setFeedbackForm({ ...feedbackForm, rating: e.target.value })} />
      <textarea placeholder="Comment" value={feedbackForm.comment} onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })} />
      <button onClick={handleFeedbackSubmit}>📨 Submit Feedback</button>
    </section>
  );
}
