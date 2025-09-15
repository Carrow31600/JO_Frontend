import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";
import OfferCard from "../components/Offers/OfferCard";
import OfferForm from "../components/Offers/OfferForm";

function OffersPage() {
   // États
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState(null); 
  const [error, setError] = useState(null);

  const { user, fetchWithAuth } = useAuth();
  const isAdmin = user?.is_superuser || false;
  const isStaff = user?.is_staff || false;

  // Charger les offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/offers/`);
        if (!response.ok) throw new Error("Erreur lors du chargement des offres");
        const data = await response.json();
        setOffers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [fetchWithAuth]);

  // Supprimer une offre (admin uniquement)
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette offre ?")) return;
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/offers/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOffers((prev) => prev.filter((offer) => offer.id !== id));
      } else {
        console.error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

// Création ou modification d'une offre
  const handleSave = async (formData) => {
    try {
      const hasId = Boolean(editingOffer?.id);  // true = modification, false = création
      const url = hasId
        ? `${import.meta.env.VITE_API_URL}/offers/${editingOffer.id}/`
        : `${import.meta.env.VITE_API_URL}/offers/`;
      const method = hasId ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Erreur lors de la sauvegarde (${res.status}) ${errBody}`);
      }

      const saved = await res.json();

      setOffers((prev) =>
        hasId ? prev.map((o) => (o.id === saved.id ? saved : o)) : [...prev, saved]
      );

      setEditingOffer(null); 
    } catch (err) {
      alert(err.message);
    }
  };

  //Gestion des états et erreur
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

// Affichage de la page
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Nos Offres</h2>

      {/* Bouton de création d'une nouvelle offre (admin/staff uniquement) */}
      {(isAdmin || isStaff) && !editingOffer && (
        <div className="mb-3">
          <Button variant="success" onClick={() => setEditingOffer({})}>
            Créer une nouvelle offre
          </Button>
        </div>
      )}

      {/* Liste des offres si on n'est pas en mode modification */}
      {editingOffer && (
        <OfferForm
          initialData={editingOffer}
          onSubmit={handleSave}
          onCancel={() => setEditingOffer(null)}
        />
      )}

      {!editingOffer && (
        <Row>
          {offers.map((offer) => (
            <Col key={offer.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <OfferCard
                offer={offer}
                isAdmin={isAdmin}
                isStaff={isStaff}
                onDelete={handleDelete}
                onEdit={(offer) => setEditingOffer(offer)}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default OffersPage;
