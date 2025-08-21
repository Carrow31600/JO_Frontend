import { useEffect, useState } from "react";
import { Carousel, Button } from "react-bootstrap";
import ModalInfo from "./ModalInfo";
import { useAuth } from "../../Auth/AuthContext";
import "./Carousel.css";

export default function CarouselLieux() {
  const [lieux, setLieux] = useState([]);
  const [selected, setSelected] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    async function loadLieux() {
      try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/lieux/`);
        if (!res.ok) {
          console.error("Erreur API lieux:", res.status);
          return;
        }
        const data = await res.json();
        setLieux(data);
      } catch (err) {
        console.error("Erreur fetch lieux:", err);
      }
    }
    loadLieux();
  }, [fetchWithAuth]);

  return (
    <>
      <Carousel>
        {lieux.map((lieu) => (
          <Carousel.Item key={lieu.id}>
            <img
              className="d-block w-100 carousel-img"
              src={lieu.photo_url}
              alt={lieu.nom || "Image"}
            />
            <Carousel.Caption>
              <h3>{lieu.nom}</h3>
              <Button variant="light" onClick={() => setSelected(lieu)}>
                Voir plus
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {selected && (
        <ModalInfo
          show={!!selected}
          onHide={() => setSelected(null)}
          item={selected}
        />
      )}
    </>
  );
}
