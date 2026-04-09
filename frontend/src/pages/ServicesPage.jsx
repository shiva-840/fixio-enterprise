import "./ServicesPage.css";
import { SERVICES } from "../data/services";

const ServicesPage = ({ searchService }) => {
  return (
    <>
      <section className="page-hero">
        <h1>All Services</h1>
        <p>Choose a service and we'll find the best professionals near you.</p>
      </section>

      <section className="section">
        <div className="service-grid large">
          {SERVICES.map((s) => (
            <div
              key={s.key}
              className="service-card large"
              onClick={() => searchService(s.key)}
            >
              <div className="service-icon big">{s.icon}</div>
              <span>{s.label}</span>
              <small>Starting from ₹249</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ServicesPage;