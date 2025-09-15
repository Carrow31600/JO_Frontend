import { useState } from "react";
import { Container, Card, Button, ListGroup } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {

  const { user, deleteAccount  } = useAuth();
  const navigate = useNavigate();

  // Modification du compte
  const handleEdit = () => {
    navigate("/account/update");
  };

  // Suppression du compte
  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
      const success = await deleteAccount();
      if (success) {
        alert("Votre compte a été supprimé avec succès.");
        navigate('/');
      } else {
        alert("Une erreur est survenue lors de la suppression du compte.");
      }
    }
  };

  // Si le user n'est pas encore chargé
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
        <h2 className="text-center mb-4">Mon compte</h2>

        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Nom d'utilisateur :</strong> {user.username}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Prénom :</strong> {user.first_name}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Email :</strong> {user.email}
          </ListGroup.Item>
        </ListGroup>

        <div className="d-grid mt-4">
          <Button variant="primary" onClick={handleEdit}>
            Modifier le compte
          </Button>
          <br />
          <Button variant="danger" onClick={handleDeleteAccount}>
            Supprimer le compte
          </Button>
        </div>
      </Card>
    </Container>
  );
}
