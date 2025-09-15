import { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Etats du formulaire
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);    // Indique si la requête est en cours

  // saisie dans le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

     // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.password2) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

     // Appel à la fonction d'inscription du contexte Auth
    const success = await register({
      username: formData.username,
      first_name: formData.first_name,
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
    });
    setLoading(false);

    if (success) {
      navigate("/login");
    } else {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  // Affichage
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-75">
      <Card className="p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Créer un compte</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Entrez votre identifiant"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              placeholder="Entrez votre prénom"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Entrez votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password2">
            <Form.Label>Confirmer le mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="password2"
              placeholder="Confirmer le mot de passe"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <a href="/login">Déjà un compte ? Se connecter</a>
        </div>
      </Card>
    </Container>
  );
}
