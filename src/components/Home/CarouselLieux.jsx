import { useEffect, useState } from "react";
import { Carousel, Button } from "react-bootstrap";
import ModalInfo from "./ModalInfo";
import "./Carousel.css";

export default function CarouselLieux() {
  const [lieux, setLieux] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}lieux/`)
      .then(res => res.json())
      .then(data => setLieux(data))
      .catch(err => console.error("Erreur fetch lieux:", err));
  }, []);

  return (
    <>
      <Carousel>
        {lieux.map(lieu => (
          <Carousel.Item key={lieu.id}>
            <img
              className="d-block w-100 carousel-img"
              src={lieu.photo_url}
              alt={lieu.nom}
            />
            <Carousel.Caption>
              <h3>{lieu.nom}</h3>
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
