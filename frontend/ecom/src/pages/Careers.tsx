import { Link } from "react-router-dom";
import "./Page.css";

export function Careers() {
  const jobs = [
    {
      title: "Full Stack Developer",
      type: "Full-time",
      location: "Remote",
      description: "Build and maintain our e-commerce platform using modern technologies."
    },
    {
      title: "Product Designer",
      type: "Full-time",
      location: "Remote",
      description: "Design intuitive user experiences for our web and mobile applications."
    },
    {
      title: "Customer Support Specialist",
      type: "Part-time",
      location: "Remote",
      description: "Assist customers with orders, inquiries, and resolve any issues."
    }
  ];

  return (
    <div className="page">
      <h1>Careers</h1>
      <p className="page-desc">Join our team and help shape the future of minimalist e-commerce.</p>
      <div className="page-content">
        <h2>Why Work With Us?</h2>
        <p>
          At MINIMAL, we value creativity, collaboration, and work-life balance. 
          We offer competitive compensation, flexible working hours, and opportunities 
          for professional growth.
        </p>
        <h2>Open Positions</h2>
        {jobs.map((job, index) => (
          <div key={index} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{job.title}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {job.type} • {job.location}
            </p>
            <p style={{ color: '#666' }}>{job.description}</p>
          </div>
        ))}
        <p style={{ marginTop: '1.5rem' }}>
          Don't see a position that fits? Email us at careers@minimal.com with your resume.
        </p>
      </div>
      <Link to="/" className="back-link">← Back to Shop</Link>
    </div>
  );
}
