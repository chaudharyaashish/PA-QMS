import { Link } from "react-router-dom";
import dentalImg from "../../images/dental.png";
import boneImg from "../../images/bone.png";
import diagnosisImg from "../../images/diagnosis.png";
import "./Services.css";

const services = [
  {
    title: "Dental treatments",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit ut elit tellus luctus nec ullamcorper mattis.",
    image: dentalImg,
  },
  {
    title: "Bone treatments",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit ut elit tellus luctus nec ullamcorper mattis.",
    image: boneImg,
  },
  {
    title: "Diagnosis",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit ut elit tellus luctus nec ullamcorper mattis.",
    image: diagnosisImg,
  },
];

export function ServicesSection() {
  return (<>
 
    <section className="services-container">
      <div className="services-header">
        <h2>Services we provide</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit ut elit tellus
          luctus nec ullamcorper mattis.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.title} className="service-card">
            <img
              src={service.image} 
              alt={service.title}
              className="service-image"
            />
            <div className="service-content">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to="/learnmore" className="learn-more-btn">
                Learn More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
export default ServicesSection;
