import { useEffect, useState } from "react";
import { Carousel, Button } from "react-bootstrap";
import ModalInfo from "./ModalInfo";
import "./Carousel.css";

export default function CarouselSports() {
  const [sports, setSports] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/sports/`)
      .then(res => res.json())
      .then(data => setSports(data))
      .catch(err => console.error("Erreur fetch sports:", err));
  }, []);

  return (
    <>
      <Carousel>
        {sports.map(sport => (
          <Carousel.Item key={sport.id}>
            <img
              className="d-block w-100 carousel-img"
              src={sport.photo_url}
              alt={sport.nom}
            />
            <Carousel.Caption>
              <h3>{sport.nom}</h3>
              <Button variant="light" onClick={() => setSelected(sport)}>
                Voir plus
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {selected && (
        <ModalInfo show={true} onHide={() => setSelected(null)} item={selected} />
      )}
    </>
  );
}
