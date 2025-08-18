import { Container, Nav, Navbar } from 'react-bootstrap';

export default function Footer() {
  return (
    <Navbar bg="light">
      <Container className="justify-content-center">
        <Nav>
          <Nav.Link href="/legal">Mentions légales</Nav.Link>
          <Nav.Link href="/cookies">Politique cookies</Nav.Link>
          <Nav.Link href="/data">Données personnelles</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
