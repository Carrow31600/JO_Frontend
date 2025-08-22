import { Row, Col, Form, Button } from "react-bootstrap";

function EventFilters({ filters, setFilters, sports, lieux }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ lieu: "", sport: "", date: "" });
  };

  return (
    <Form className="mb-3">
      <Row className="g-2">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Filtrer par lieu"
            name="lieu"
            value={filters.lieu}
            onChange={handleChange}
            list="lieux-list"
          />
          <datalist id="lieux-list">
            {lieux?.map((l) => (
              <option key={l.id} value={l.nom} />
            ))}
          </datalist>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Filtrer par sport"
            name="sport"
            value={filters.sport}
            onChange={handleChange}
            list="sports-list"
          />
          <datalist id="sports-list">
            {sports?.map((s) => (
              <option key={s.id} value={s.nom} />
            ))}
          </datalist>
        </Col>
        <Col md={4}>
          <div className="d-flex gap-2">
            <Form.Control
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
            />
            <Button variant="secondary" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default EventFilters;
