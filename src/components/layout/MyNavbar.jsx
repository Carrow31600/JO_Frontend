import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../../assets/logo.png';

export default function MyNavbar() {
  return (
    <Navbar bg="light" data-bs-theme="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            height="40"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/offers">Offres</Nav.Link>
            <Nav.Link href="/events">Épreuves</Nav.Link>
            <Nav.Link href="/cart">Panier</Nav.Link>
            <Nav.Link href="/login">Connexion</Nav.Link>
            <Nav.Link href="/scan">Scan</Nav.Link>
            <Nav.Link href="/stats">Stats</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
