import { Container } from 'react-bootstrap';

export default function Layout({ children, className }) {
  return (
    <Container fluid="md" className={`mt-3 ${className || ''}`}>
      {children}
    </Container>
  );
}

