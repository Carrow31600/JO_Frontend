import { useState, useEffect } from "react";
import { Table, Card, Form, Button } from "react-bootstrap";
import { useCart } from "../Cart/CartContext";
import "./EventList.css";

function EventList({ events, offers, selections, setSelections, sportsList, lieuxList }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (eventId, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value,
      },
    }));
  };

  const handleAddToCart = (event) => {
    const sel = selections[event.id];
    if (!sel || !sel.offerId || !sel.quantity || sel.quantity <= 0) return;

    const offer = offers.find((o) => o.id === Number(sel.offerId));
    if (!offer) return;

    addToCart(event, offer, parseInt(sel.quantity, 10), sportsList, lieuxList);
  };


  const getSportName = (id) => sportsList?.find((s) => s.id === id)?.nom || id;
  const getLieuName = (id) => lieuxList?.find((l) => l.id === id)?.nom || id;

  const renderEventRow = (event) => {
    const sel = selections[event.id] || {};
    const quantity = sel.quantity || "";
    const offerId = sel.offerId || "";
    const selectedOffer = offers.find((o) => o.id === Number(offerId));
    const total = selectedOffer ? (quantity || 0) * parseFloat(selectedOffer.prix) : 0;

    return (
      <tr key={event.id}>
        <td>{event.date}</td>
        <td>{getLieuName(event.lieu)}</td>
        <td>{getSportName(event.sport)}</td>
        <td>
          <Form.Select
            value={offerId}
            onChange={(e) => handleChange(event.id, "offerId", e.target.value)}
          >
            <option value="">Sélectionner une offre</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {`${offer.nom} - (${offer.nombre_places} places) - ${offer.prix}€`}
              </option>
            ))}
          </Form.Select>
        </td>
        <td>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => handleChange(event.id, "quantity", e.target.value)}
          />
        </td>
        <td>{total ? `${total.toFixed(2)}€` : "-"}</td>
        <td>
          <Button
            disabled={!offerId || !quantity}
            onClick={() => handleAddToCart(event)}
          >
            Ajouter au panier
          </Button>
        </td>
      </tr>
    );
  };

  if (isMobile) {
    return (
      <div className="d-flex flex-column gap-3">
        {events.map((event) => {
          const sel = selections[event.id] || {};
          const quantity = sel.quantity || "";
          const offerId = sel.offerId || "";
          const selectedOffer = offers.find((o) => o.id === Number(offerId));
          const total = selectedOffer ? (quantity || 0) * parseFloat(selectedOffer.prix) : 0;

          return (
            <Card key={event.id} className="event-card">
              <Card.Body>
                <Card.Title className="event-card-title">{getSportName(event.sport)}</Card.Title>
                <Card.Text className="event-card-text">
                  <strong>Date:</strong> {event.date} <br />
                  <strong>Lieu:</strong> {getLieuName(event.lieu)}
                </Card.Text>
                <Form.Select
                  value={offerId}
                  onChange={(e) => handleChange(event.id, "offerId", e.target.value)}
                  className="mb-2"
                >
                  <option value="">Sélectionner une offre</option>
                  {offers.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {`${offer.nom} - (${offer.nombre_places} places) - ${offer.prix}€`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleChange(event.id, "quantity", e.target.value)}
                  className="mb-2"
                />
                <div className="mb-2">
                  <strong>Total:</strong> {total ? `${total.toFixed(2)}€` : "-"}
                </div>
                <Button
                  disabled={!offerId || !quantity}
                  onClick={() => handleAddToCart(event)}
                >
                  Ajouter au panier
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Table bordered responsive className="events-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Lieu</th>
          <th>Sport</th>
          <th>Offre</th>
          <th>Quantité</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{events.map(renderEventRow)}</tbody>
    </Table>
  );
}

export default EventList;
