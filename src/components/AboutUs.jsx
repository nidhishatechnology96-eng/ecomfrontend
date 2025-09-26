import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import {
  FaLeaf,
  FaHandsHelping,
  FaRecycle,
  FaUsers,
  FaStar,
  FaBoxOpen,
} from "react-icons/fa";

// A reusable hook for the count-up animation
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          // Prevent division by zero if end is 0
          const stepTime = end > 0 ? Math.abs(Math.floor(duration / end)) : duration;
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) {
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      {
        threshold: 0.5,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration]);

  return [count, ref];
};

// Custom CSS for advanced styling
const aboutUsStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in-section {
    animation: fadeIn 0.8s ease-in-out forwards;
  }

  .feature-card, .stat-card, .testimonial-card, .cta-section {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }

  .feature-card:hover, .stat-card:hover, .testimonial-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
  }

  .cta-section:hover {
    transform: scale(1.02);
  }
  
  .testimonial-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 3px solid #198754;
  }
`;

function AboutUs() {
  // Re-added the useCountUp for customers with an end value of 50
  const [productsCount, productsRef] = useCountUp(100);
  const [customersCount, customersRef] = useCountUp(50);
  const [farmsCount, farmsRef] = useCountUp(50);

  // Intersection Observer for fade-in effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-section');
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.section-to-fade');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);


  return (
    <>
      <style>{aboutUsStyles}</style>
      <div className="d-flex flex-column min-vh-100 about-page bg-light">
        <div className="container my-5">
          {/* Hero Section */}
          <section
            className="p-5 mb-5 rounded-4 shadow-lg text-center text-white section-to-fade"
            style={{ background: "linear-gradient(135deg, #198754, #28a745)" }}
          >
            <h1 className="display-5 fw-bold">About <span className="text-warning">HYJAIN</span></h1>
            <p className="lead mt-3" style={{ opacity: 0.9 }}>
              We craft premium dehydrated foods, authentic masalas, and pure mineral water.
              <br />
              Our promise is simple: <strong>taste, purity, and health for every family.</strong>
            </p>
          </section>

          {/* Mission, Vision, Values */}
          <section className="row g-4 text-center section-to-fade">
            <div className="col-lg-4 col-md-12">
              <div className="card h-100 shadow-sm border-0 feature-card p-3">
                <div className="card-body">
                  <FaLeaf className="display-4 text-success" />
                  <h4 className="card-title mt-3 fw-bold">Farm-to-Table</h4>
                  <p className="card-text text-muted">
                    Sourced from trusted farms and processed with care for unmatched freshness.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <div className="card h-100 shadow-sm border-0 feature-card p-3">
                <div className="card-body">
                  <FaHandsHelping className="display-4 text-success" />
                  <h4 className="card-title mt-3 fw-bold">Quality First</h4>
                  <p className="card-text text-muted">
                    Hygienic processing, rich nutrition, and consistent taste in every product.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <div className="card h-100 shadow-sm border-0 feature-card p-3">
                <div className="card-body">
                  <FaRecycle className="display-4 text-success" />
                  <h4 className="card-title mt-3 fw-bold">Sustainability</h4>
                  <p className="card-text text-muted">
                    Long shelf life, minimal waste, and eco-friendly sourcing practices.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="row g-4 mt-5 text-center section-to-fade">
            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-3 shadow-sm stat-card h-100">
                <FaBoxOpen className="stat-icon text-success h1" />
                <div className="h2 fw-bold mb-0" ref={productsRef}>{productsCount}+</div>
                <div className="text-muted">Products</div>
              </div>
            </div>
            
            {/* UPDATED HAPPY CUSTOMERS CARD WITH ANIMATION */}
            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-3 shadow-sm stat-card h-100">
                <FaUsers className="stat-icon text-success h1" />
                <div className="h2 fw-bold mb-0" ref={customersRef}>
                  {customersCount}+
                </div>
                <div className="text-muted">Happy Customers</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-3 shadow-sm stat-card h-100">
                <FaLeaf className="stat-icon text-success h1" />
                <div className="h2 fw-bold mb-0" ref={farmsRef}>{farmsCount}+</div>
                <div className="text-muted">Partner Farms</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-4 bg-white rounded-3 shadow-sm stat-card h-100">
                <FaStar className="stat-icon text-warning h1" />
                <div className="h2 fw-bold mb-0">4.8/5</div>
                <div className="text-muted">Avg. Rating</div>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="mt-5 p-5 bg-dark text-white rounded-4 text-center shadow-lg section-to-fade">
            <h3 className="fw-bold text-warning">Our Vision</h3>
            <p className="lead mb-0 fst-italic">
              To bring natural, healthy, and flavorful products into every household
              while supporting farmers and promoting sustainability.
            </p>
          </section>
          
          {/* Testimonials Section */}
          <section className="mt-5 section-to-fade">
            <h2 className="text-center fw-bold mb-5">What Our Customers Say</h2>
            <div className="row g-4">
              {[
                { img: "https://randomuser.me/api/portraits/women/44.jpg", name: "Priya S.", location: "Bengaluru", text: "HYJAIN masalas remind me of my grandmother’s cooking – authentic and flavorful." },
                { img: "https://randomuser.me/api/portraits/men/36.jpg", name: "Ramesh K.", location: "Mysuru", text: "The dehydrated veggies are a lifesaver. Quick to cook, tasty, and super healthy." },
                { img: "https://randomuser.me/api/portraits/women/65.jpg", name: "Anita R.", location: "Chennai", text: "Finally, a brand that delivers purity and taste without compromise. Highly recommend!" },
                { img: "https://randomuser.me/api/portraits/men/72.jpg", name: "Rahul M.", location: "Hyderabad", text: "HYJAIN’s mineral water is pure and refreshing. Perfect for my family’s health needs." }
              ].map((testimonial, index) => (
                <div className="col-md-6 col-lg-3 d-flex align-items-stretch" key={index}>
                  <div className="card testimonial-card shadow-sm h-100 border-0 text-center w-100">
                    <div className="card-body d-flex flex-column">
                      <img
                        src={testimonial.img}
                        alt={testimonial.name}
                        className="rounded-circle mb-3 align-self-center testimonial-img"
                      />
                      <p className="card-text fst-italic text-muted flex-grow-1">“{testimonial.text}”</p>
                      <div className="text-warning mb-2">{'⭐'.repeat(5)}</div>
                      <h6 className="mb-0 text-success fw-bold">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.location}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="mt-5 p-5 text-center text-white rounded-4 shadow-lg cta-section section-to-fade"
            style={{ background: "linear-gradient(135deg, #198754, #28a745)" }}
          >
            <h2 className="fw-bold mb-3">Join the HYJAIN Family Today</h2>
            <p className="lead mb-4">
              Experience the goodness of nature with our range of healthy and delicious products.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/shop" className="btn btn-warning btn-lg px-5 fw-bold shadow-sm">
                🛒 Shop Now
              </Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg px-5 fw-bold shadow-sm">
                📩 Contact Us
              </Link>
            </div>
          </section>
        </div>

       
      </div>
    </>
  );
}

export default AboutUs;