import { Container, Button } from "react-bootstrap";
import "./cover.css";

export default function Cover({ image, title, children }) {
  return (
    <div className="cover" style={{ backgroundImage: `url(${image})` }}>
      <div className="cover-overlay">
        <Container className="text-center text-white">
          <h1 className="display-4 fw-bold mb-4">{title}</h1>
          <div className="mx-auto col-md-8">
            {children}  
          </div>
        </Container>
      </div>
    </div>
  );
}
