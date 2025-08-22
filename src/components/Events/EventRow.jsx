import { Form, Button } from "react-bootstrap";

function EventRow({ event, offers, sel, onChange, isAddDisabled }) {
  const selectedOffer = offers.find((o) => o.id === parseInt(sel.offer));
  const total = sel.quantity && selectedOffer ? sel.quantity * selectedOffer.price : 0;

  return (
    <tr>
      <td>{event.date}</td>
      <td>{event.lieu}</td>
      <td>{event.sport}</td>
      <td>
        <Form.Select
          value={sel.offer || ""}
          onChange={(e) => onChange(event.id, "offer", e.target.value)}
        >
          <option value="">Choisir une offre...</option>
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.nom} - ({offer.nombre_places} places) - {offer.prix}€
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Control
          type="number"
          min="1"
          value={sel.quantity || ""}
          onChange={(e) => onChange(event.id, "quantity", parseInt(e.target.value))}
        />
      </td>
      <td>{total} €</td>
      <td>
        <Button disabled={isAddDisabled(event.id)}>Ajouter</Button>
      </td>
    </tr>
  );
}

export default EventRow;
