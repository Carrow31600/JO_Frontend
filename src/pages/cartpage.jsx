import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Card, Badge, Alert } from "react-bootstrap";
import { useCart } from "../components/Cart/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Grand écran ou mobile
  const [paymentStatus, setPaymentStatus] = useState(null); // état en fonction du paiement
  const navigate = useNavigate();
  const { user, fetchWithAuth } = useAuth();

  // Debug = affiche l'utilisateur dans la console
  useEffect(() => {
    console.log("Utilisateur connecté :", user);
  }, [user]);

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calcul du panier
  const totalHT = cart.reduce((sum, item) => sum + item.total, 0);
  const TVA = totalHT * 0.20;
  const totalTTC = totalHT + TVA;

  // Fonction de paiement
  const handlePayment = async () => {
    if (!user) {
      setPaymentStatus("not-logged-in");
      return;
    }

    try {
       // Transforme le panier en format attendu par l’API
      const lines = cart.map(item => ({
        event: item.eventId,
        offer: item.offerId,
        quantity: item.quantity,
      }));

      // Appel API mock de paiement
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}payment/mock/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            lines: lines
          }),
        },
        true
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Paiement réussi :", data);
        setPaymentStatus("success");
        clearCart();
      } else {
        const err = await res.json();
        console.error("Erreur paiement :", err);
        setPaymentStatus("error");
      }
    } catch (error) {
      console.error("Exception paiement :", error);
      setPaymentStatus("error");
    }
  };

  // format mobile
  const CartItemCard = ({ item, onRemove }) => (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>{item.eventDate}</span>
          <Badge bg="primary" className="fs-6">{item.sportName}</Badge>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {item.lieuName}
        </Card.Subtitle>
        <Card.Text>
          <strong>Offre :</strong> {item.offerName} <br />
          <strong>Quantité :</strong> {item.quantity} <br />
          <strong>Prix unitaire :</strong> {item.price} €
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <span><strong>Total :</strong> {item.total.toFixed(2)} €</span>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={onRemove}
          >
            Supprimer
          </Button>
        </div>
      </Card.Body>
    </Card>
  );


  // Affichage du panier (pc + mobile)
  const renderCartItems = () => {
    if (isMobile) {
      // affichage de cartes sur mobile
      return cart.map((item, index) => (
        <CartItemCard
          key={index}
          item={item}
          onRemove={() => removeFromCart(index)}
        />
      ));
    } else {
      // Afficga d'un tableau sur PC
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Lieu</th>
              <th>Sport</th>
              <th>Offre</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{item.eventDate}</td>
                <td>{item.lieuName}</td>
                <td>{item.sportName}</td>
                <td>{item.offerName}</td>
                <td>{item.quantity}</td>
                <td>{item.price} €</td>
                <td>{item.total.toFixed(2)} €</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(index)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Mon panier</h2>

      {/*Toujours afficher les messages de paiement */}
      {paymentStatus === "not-logged-in" && (
        <Alert variant="warning" className="text-center">
          Vous devez être connecté pour payer.{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
          >
            Se connecter
          </span>
        </Alert>
      )}

      {paymentStatus === "success" && (
        <Alert variant="success" className="text-center">
          Paiement réussi ! Votre commande a été enregistrée.
        </Alert>
      )}

      {paymentStatus === "error" && (
        <Alert variant="danger" className="text-center">
          Le paiement a échoué. Veuillez réessayer.
        </Alert>
      )}

      {cart.length === 0 ? (
        <p className="text-center">Votre panier est vide.</p>
      ) : (
        <Row>
          <Col xs={12} md={8}>
            {renderCartItems()}
            <div className="d-grid gap-2 mt-3">
              <Button variant="outline-warning" onClick={clearCart}>
                Vider le panier
              </Button>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <Card className="mt-3 mt-md-0">
              <Card.Body>
                <Card.Title className="text-center">Récapitulatif</Card.Title>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Total HT :</span>
                  <span>{totalHT.toFixed(2)} €</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>TVA (20%) :</span>
                  <span>{TVA.toFixed(2)} €</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total TTC :</span>
                  <span>{totalTTC.toFixed(2)} €</span>
                </div>

                <div className="d-grid gap-2 mt-3">
                  <Button variant="success" onClick={handlePayment}>
                    Payer
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CartPage;
