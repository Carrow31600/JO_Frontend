import { Card, Form, Button } from "react-bootstrap";

function EventCard({ event, offers, sel, onChange, isAddDisabled }) {
  const selectedOffer = offers.find((o) => o.id === parseInt(sel.offer));
  const total = sel.quantity && selectedOffer ? sel.quantity * selectedOffer.price : 0;

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {event.date} - Lieu {event.lieu}
        </Card.Title>
        <Card.Text>Sport : {event.sport}</Card.Text>

        <Form.Select
          value={sel.offer || ""}
          onChange={(e) => onChange(event.id, "offer", e.target.value)}
          className="mb-2"
        >
          <option value="">Choisir une offre...</option>
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.name} - {offer.price} €
            </option>
          ))}
        </Form.Select>

        <Form.Control
          type="number"
          min="1"
          value={sel.quantity || ""}
          onChange={(e) => onChange(event.id, "quantity", parseInt(e.target.value))}
          className="mb-2"
        />

        <div>Total : {total} €</div>

        <Button disabled={isAddDisabled(event.id)} className="mt-2">
          Ajouter au panier
        </Button>
      </Card.Body>
    </Card>
  );
}

export default EventCard;
