import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import logo from '../../assets/logo.png';
import { useAuth } from '../../Auth/AuthContext';

export default function MyNavbar() {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  // Vérifie si l'utilisateur est admin
  const isAdmin = user?.is_staff; 

  return (
    <Navbar bg="light" data-bs-theme="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} height="40" className="d-inline-block align-top" alt="Logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/offers">Offres</Nav.Link>
            <Nav.Link href="/events">Épreuves</Nav.Link>
            <Nav.Link href="/cart">Panier</Nav.Link>

            {user ? (
              <NavDropdown title="Mon compte" id="nav-dropdown">
                <NavDropdown.Item href="/account">Gérer mon compte</NavDropdown.Item>
                <NavDropdown.Item href="/my-tickets">Mes tickets</NavDropdown.Item>
                {logout && <NavDropdown.Item onClick={logout}>Déconnexion</NavDropdown.Item>}
              </NavDropdown>
            ) : (
              <Nav.Link href="/login">Connexion</Nav.Link>
            )}

            <Nav.Link href="/scan">Scan</Nav.Link>

            {/* Affiche Stats uniquement si user est connecté ET admin */}
            {user && isAdmin && <Nav.Link href="/stats">Stats</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
