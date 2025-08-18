import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyNavbar from './components/layout/mynavbar';
import Footer from './components/layout/footer';
import Layout from './components/layout/layout';
import HomePage from './pages/homepage';
import OffersPage from './pages/OffersPage';
import EventsPage from './pages/EventsPage';
import CartPage from './pages/cartpage';
import LoginPage from './pages/loginpage';
import ScanPage from './pages/ScanPage';
import StatsPage from './pages/StatsPage';


export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
      <MyNavbar />
      <Layout className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Layout>
      <Footer />
    </div>
    </Router>
  );
}
