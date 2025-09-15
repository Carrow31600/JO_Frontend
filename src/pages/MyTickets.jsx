import React, { useEffect, useState } from "react";
import { Table, Card, Button, Row, Col, Modal, Container } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useAuth } from "../Auth/AuthContext";

// vue mobile -> Carte
function TicketCard({ ticket, onShowQRCode }) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{ticket.event_name}</Card.Title>
        <Card.Text>Offre : {ticket.offer_name}</Card.Text>
        <Card.Text>Quantité : {ticket.quantity}</Card.Text>
        <Button size="sm" onClick={() => onShowQRCode(ticket)}>
          Voir QRCode
        </Button>
      </Card.Body>
    </Card>
  );
}

// liste des tickets de l'utilisateur connecté
function MyTickets() {
  const { fetchWithAuth, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Chargement des tickets
  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      try {
        // Appel API pour récupérer les tickets de l'utilisateur
        const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/orders/me/`, {}, true);
        if (res.ok) {
          const data = await res.json();
          console.log("Tickets reçus :", data);
          setTickets(data);
        } else {
          console.error("Erreur fetch tickets :", res.status);
        }
      } catch (err) {
        console.error("Exception fetch tickets :", err);
      }
    };

    fetchTickets();
  }, [user]);
  // Si aucun utilisateur n'est connecté → message d'invitation à se connecter
  if (!user) return <p>Veuillez vous connecter pour voir vos tickets.</p>;

  return (
    <Container>
      <h2 className="my-4">Mes tickets</h2>

      {tickets.length === 0 ? (
        <p>Aucun ticket pour le moment.</p>
      ) : (
        <>
          {/* Tableau pour desktop */}
          <div className="d-none d-md-block">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Événement</th>
                  <th>Offre</th>
                  <th>Quantité</th>
                  <th>QR Code</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.event_name}</td>
                    <td>{ticket.offer_name}</td>
                    <td>{ticket.quantity}</td>
                    <td>
                      <Button size="sm" onClick={() => setSelectedTicket(ticket)}>
                        Voir QRCode
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Cartes pour mobile */}
          <div className="d-block d-md-none">
            <Row xs={1} className="g-3">
              {tickets.map((ticket) => (
                <Col key={ticket.id}>
                  <TicketCard ticket={ticket} onShowQRCode={setSelectedTicket} />
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}

      {/* QRCode */}
      <Modal show={!!selectedTicket} onHide={() => setSelectedTicket(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code du ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedTicket && (
            <>
              <h5>{selectedTicket.event_name}</h5>
              <p>Offre : {selectedTicket.offer_name}</p>
              <QRCode value={selectedTicket.order_key} size={200} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedTicket(null)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyTickets;
