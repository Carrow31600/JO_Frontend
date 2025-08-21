import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

function OfferForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nom: initialData.nom || "",
    nombre_places: initialData.nombre_places ?? "",
    prix: initialData.prix ?? "",
  });


  useEffect(() => {
    setFormData({
      nom: initialData.nom || "",
      nombre_places: initialData.nombre_places ?? "",
      prix: initialData.prix ?? "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Nom de l'offre</Form.Label>
        <Form.Control
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nombre de places</Form.Label>
        <Form.Control
          type="number"
          name="nombre_places"
          value={formData.nombre_places}
          onChange={handleChange}
          required
          min={1}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Prix (€)</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="prix"
          value={formData.prix}
          onChange={handleChange}
          required
          min={0}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Enregistrer
      </Button>

      {onCancel && (
        <Button variant="secondary" className="ms-2" type="button" onClick={onCancel}>
          Annuler
        </Button>
      )}
    </Form>
  );
}

export default OfferForm;
