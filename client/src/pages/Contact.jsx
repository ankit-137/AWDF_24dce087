import { useState } from 'react';

const MAX_CHARS = 500;

function Contact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && message.trim()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Message Sent!</h2>
        <p>Thanks, <strong>{name}</strong>! I'll get back to you soon.</p>
        <button
          className="btn-primary"
          style={{ marginTop: '1.5rem' }}
          onClick={() => { setName(''); setMessage(''); setSubmitted(false); }}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Contact Me</h2>
      <p style={{ marginBottom: '2rem' }}>Have a question or want to collaborate? Drop me a message.</p>
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contact-name">Your Name</label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ankit Patel"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Leave your thoughts here.."
            required
          />
          <p className="char-counter">
            {message.length} / {MAX_CHARS} characters
          </p>
        </div>
        <button type="submit" className="btn-primary">Send Message </button>
      </form>
    </div>
  );
}

export default Contact;
