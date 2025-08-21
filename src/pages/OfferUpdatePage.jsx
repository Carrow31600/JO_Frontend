import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";
import OfferForm from "../components/Offers/OfferForm";

function OfferUpdatePage() {
  const { id } = useParams(); // récupère l'id 
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charge l’offre depuis l’API
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/offers/${id}/`);
        if (!response.ok) throw new Error("Impossible de charger l'offre");
        const data = await response.json();
        setOffer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id, fetchWithAuth]);

  // Envoi du formulaire
  const handleUpdate = async (formData) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/offers/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification");

      navigate("/offers"); // redirection vers la liste 
    } catch (err) {
      setError(err.message);
    }
  };

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

  return (
    <Container className="mt-4">
      <h2>Modifier l'offre</h2>
      <OfferForm initialData={offer} onSubmit={handleUpdate} />
    </Container>
  );
}

export default OfferUpdatePage;
