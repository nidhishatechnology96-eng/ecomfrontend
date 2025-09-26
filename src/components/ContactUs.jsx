import React, { useState } from "react";
import Footer from "./Footer";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaUser,
} from "react-icons/fa";

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="d-flex flex-column min-vh-100 contact-page bg-light">
      <div className="container my-5">
        {/* Hero Section */}
        <div
          className="p-5 mb-5 text-white rounded-4 shadow-lg text-center"
          style={{ background: "linear-gradient(135deg, #198754, #28a745)" }}
        >
          <h2 className="fw-bold display-5">
            Contact <span className="text-warning">HYJAIN</span>
          </h2>
          <p className="lead mt-3 mb-0" style={{ opacity: 0.9 }}>
            Have a question, feedback, or idea?
            <br />We’re here to listen and help you anytime.
          </p>
        </div>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="card shadow-lg border-0 h-100 rounded-4">
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold text-success">✉️ Send a Message</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <FaUser className="me-2 text-success" />
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 shadow-sm"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <FaEnvelope className="me-2 text-success" />
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-3 shadow-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea
                      className="form-control rounded-3 shadow-sm"
                      rows="4"
                      placeholder="Write your message here..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-semibold shadow-sm"
                  >
                    🚀 Send Message
                  </button>

                  {/* Custom Success Message */}
                  {sent && (
                    <div
                      className="mt-3 text-center shadow-sm rounded-4 p-3"
                      style={{
                        background: "#e6f9f0", // Light green background
                        color: "#198754",      // Dark green text
                        fontWeight: "600",
                        borderLeft: "6px solid #198754", // Green accent border
                      }}
                    >
                      🎉 Your message has been sent successfully!
                      <br />
                      <small className="text-muted">
                        We’ll get back to you shortly.
                      </small>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-6">
            <div className="card shadow-lg border-0 h-100 rounded-4">
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold text-success">📞 Contact Information</h5>

                <p className="mb-2">
                  <FaEnvelope className="me-2 text-success" />
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:Hyjainfoodproducts@gmail.com"
                    className="text-decoration-none text-dark"
                  >
                    Hyjainfoodproducts@gmail.com
                  </a>
                </p>
                <p className="mb-2">
                  <FaPhoneAlt className="me-2 text-success" />
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:+919591500590"
                    className="text-decoration-none text-dark"
                  >
                    +91 9591500590
                  </a>
                </p>
                <p className="mb-4">
                  <FaMapMarkerAlt className="me-2 text-success" />
                  <strong>Address:</strong> 482, Outer Ring Rd, Kadarenahalli
                  Park, Banashankari, Bengaluru, Karnataka 560070
                </p>

                {/* Opening Hours */}
                <h6 className="fw-bold mb-2 text-success">
                  <FaClock className="me-2" />
                  Opening Hours
                </h6>
                <p className="text-muted mb-1">Mon - Sat: 9:00 AM – 7:00 PM</p>
                <p className="text-muted mb-4">Sunday: Closed</p>

                {/* Social Media */}
                <h6 className="fw-bold mb-3 text-success">🌐 Follow Us</h6>
                <div className="d-flex gap-4 fs-4">
                  <a href="#" className="text-success" title="Facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" className="text-success" title="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="text-success" title="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="text-success" title="LinkedIn">
                    <FaLinkedin />
                  </a>
                </div>

                <hr className="my-4" />

                {/* Map */}
                <div className="ratio ratio-16x9 rounded-4 shadow-sm overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d301.6017703220498!2d77.56504176122152!3d12.916787494867494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae157ef6a23f81%3A0xfb3c09a498fef3e5!2s482%2C%20Outer%20Ring%20Rd%2C%20Kadarenahalli%20Park%2C%20Banashankari%20Stage%20II%2C%20Banashankari%2C%20Bengaluru%2C%20Karnataka%20560070!5e1!3m2!1sen!2sin!4v1757580864535!5m2!1sen!2sin"
                    title="HYJAIN Location"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Contact;