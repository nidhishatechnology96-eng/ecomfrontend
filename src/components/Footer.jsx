import React from "react";
import { Link } from "react-router-dom";
import LOGOH from "../assets/l.png"; // Ensure this path is correct

// CSS is now precisely tailored to match the image provided.
const footerStyles = `
  .footer-final {
    background-color: #2c303a;
    color: #f6fbffff;
    font-size: 0.9rem;
    line-height: 1.7;
  }
  .footer-final h5 {
    color: #ffffff;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 0.9rem;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 1.5rem;
    display: inline-block;
  }
  .footer-final h5::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #0d6efd;
  }
  .footer-final a {
    color: #fdfeffff;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }
  .footer-final a:hover {
    color: #ffffff;
  }
  .footer-final .logo {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: #fff;
    padding: 5px;
  }
  .footer-final .brand-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #d2f1efff;
  }
  .footer-final .social-icon {
    font-size: 1.25rem;
    color: #0066ffff;
    transition: transform 0.2s ease-in-out;
  }
  .footer-final .social-icon:hover {
    transform: scale(1.1);
  }
  .footer-final .contact-item {
    display: flex;
    align-items: center;
  }
  .footer-final .contact-item i {
    color: #0d6efd;
    font-size: 1.2rem;
    margin-right: 12px;
  }
  .footer-final .copyright-bar {
    background-color: #000000;
    color: #cfe2f3ff;
    font-size: 0.8rem;
  }
  .footer-final .form-control {
    background-color: #fff;
    border: none;
    color: #212529;
  }

  /* --- NEW HOVER STYLES TO MATCH IMAGE --- */
  /* Target the actual text/link elements inside the list items */
  .footer-final .hover-links a,
  .footer-final .hover-links .contact-item > span {
    position: relative; /* Needed for positioning the ::after pseudo-element */
    padding-bottom: 4px; /* Adds a little space for the underline */
  }

  /* Create the underline pseudo-element */
  .footer-final .hover-links a::after,
  .footer-final .hover-links .contact-item > span::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%; /* 100% of the element's width, which is the text width */
    height: 2px;
    background-color: #0d6efd;
    /* Animate the line from left to right - hidden by default */
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease-in-out;
  }

  /* On hover of the PARENT li, animate the underline of the CHILD text element */
  .footer-final .hover-links li:hover a::after,
  .footer-final .hover-links li:hover .contact-item > span::after {
    transform: scaleX(1); /* Show the line on hover */
  }
`;

function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
    e.target.reset();
  };

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="footer-final mt-auto">
        <div className="container py-5">
          <div className="row gy-5">

            {/* Column 1: Brand & Socials */}
            <div className="col-lg-4 col-md-12 text-center text-lg-start">
              <div className="d-flex align-items-center mb-4 justify-content-center justify-content-lg-start">
                <img src={LOGOH} alt="HYJAIN Logo" className="logo me-3" />
                <span className="brand-name">HYJAIN</span>
              </div>
              <p className="pe-lg-4">
                Delivering purity and authentic taste right to your doorstep. Experience our range of premium water, spices, and dehydrated products.
              </p>
              <div className="d-flex gap-4 mt-4 justify-content-center justify-content-lg-start">
                <a href="#!" className="social-icon" title="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="#!" className="social-icon" title="Twitter"><i className="bi bi-twitter-x"></i></a>
                <a href="#!" className="social-icon" title="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#!" className="social-icon" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-lg-2 col-md-4 text-center text-lg-start">
              <h5 className="mb-4">Links</h5>
              <ul className="list-unstyled hover-links">
                <li className="mb-2"><Link to="/about">About Us</Link></li>
                <li className="mb-2"><Link to="/shop">Shop</Link></li>
                <li className="mb-2"><Link to="/contact">Contact</Link></li>
                <li className="mb-2"><Link to="/cart">Cart</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="col-lg-3 col-md-4 text-center text-lg-start">
              <h5 className="mb-4">Contact</h5>
              <ul className="list-unstyled hover-links">
                <li className="mb-3 contact-item">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>482, Outer Ring Rd, Banashankari, Bengaluru, Karnataka 560070</span>
                </li>
                <li className="mb-3 contact-item">
                  <i className="bi bi-envelope-fill"></i>
                  <a href="mailto:Hyjainfoodproducts@gmail.com">Hyjainfoodproducts@gmail.com</a>
                </li>
                <li className="mb-3 contact-item">
                  <i className="bi bi-telephone-fill"></i>
                  <a href="tel:+919591500590">+91 9591500590</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="col-lg-3 col-md-4 text-center text-lg-start">
              <h5 className="mb-4">Stay Updated</h5>
              <p>Join our newsletter to get the latest deals and product updates.</p>
              <form onSubmit={handleNewsletterSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="copyright-bar text-center py-3">
          <div className="container">
            © {new Date().getFullYear()} HYJAIN Food Products. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;