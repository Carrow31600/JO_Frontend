import { Modal, Button, Image } from "react-bootstrap";
import "./ModalInfo.css"; // pour gérer la taille de l'image

export default function ModalInfo({ show, onHide, item }) {
  if (!item) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{item.nom}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={item.photo_url} alt={item.nom} fluid className="modal-img mb-3" />
        <p>{item.description}</p>
        {item.ville && <p><strong>Ville :</strong> {item.ville}</p>}
        {item.code_postal && <p><strong>Code postal :</strong> {item.code_postal}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
}
