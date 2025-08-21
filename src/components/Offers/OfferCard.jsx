import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import ticketImg from "../../assets/ticket.avif";

function OfferCard({ offer, isAdmin, isStaff, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{offer.nom}</Card.Title>
        <Card.Img
          variant="top"
          src={ticketImg}
          alt="Image ticket"
          className="mb-3"
        />
        <Card.Text>
          <strong>Places :</strong> {offer.nombre_places} <br />
          <strong>Prix :</strong> {offer.prix} €
        </Card.Text>

        {(isAdmin || isStaff) && (
          <div className="d-flex justify-content-between">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/offers/${offer.id}/edit`)}
            >
              Modifier
            </Button>
            {isAdmin && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(offer.id)}
              >
                Supprimer
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default OfferCard;
