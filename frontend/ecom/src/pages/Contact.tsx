import { useState } from "react";
import { Link } from "react-router-dom";
import "./Page.css";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page">
        <h1>Contact Us</h1>
        <div className="page-content">
          <p>Thank you for reaching out! We'll get back to you within 24-48 hours.</p>
        </div>
        <Link to="/" className="back-link">← Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Contact Us</h1>
      <p className="page-desc">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <input type="text" placeholder="Subject" required />
        <textarea placeholder="Your Message" required />
        <button type="submit">Send Message</button>
      </form>
      <Link to="/" className="back-link">← Back to Shop</Link>
    </div>
  );
}
