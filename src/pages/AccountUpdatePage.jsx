import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountUpdatePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Etat initial
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    email: user?.email || "",
  });

  // Etats
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Saisie dans le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // MAJ Profil
    const updated = await updateProfile(formData);
    setLoading(false);

    if (updated) {
      setSuccess("Compte mis à jour avec succès !");
      setTimeout(() => {
        navigate("/account"); // retourne à la page compte
      }, 1500);
    } else {
      setError("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  };

  // Utilisateur pas encore chargé
  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-75">
        <p>Chargement...</p>
      </Container>
    );
  }

  // Affichage de la page
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-75">
      <Card className="p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Modifier mon compte</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Entrez votre prénom"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre email"
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
