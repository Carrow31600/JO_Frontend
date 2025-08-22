import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import MyNavbar from './components/layout/mynavbar';
import Footer from './components/layout/footer';
import Layout from './components/layout/layout';
import HomePage from './pages/homepage';
import OffersPage from './pages/OffersPage';
import OfferUpdatePage from "./pages/OfferUpdatePage";
import EventsPage from './pages/EventsPage';
import CartPage from './pages/cartpage';
import LoginPage from './pages/LoginPage';
import ScanPage from './pages/ScanPage';
import StatsPage from './pages/StatsPage';
import CookieConsent from './components/layout/CookieConsent';
import LegalNotices from './pages/Footer/LegalNotices';
import PersonalData from './pages/Footer/PersonalData';
import CookiesPage from './pages/Footer/CookiesPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AccountUpdatePage from './pages/AccountUpdatePage';

function AppWithRouter() {
  const navigate = useNavigate(); 

  return (
    <AuthProvider navigate={navigate}>
      <div className="d-flex flex-column min-vh-100">
        <MyNavbar />
        <Layout className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/update" element={<AccountUpdatePage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/offers/:id/edit" element={<OfferUpdatePage />} />
            {/* Pages du footer */}
            <Route path="/legal" element={<LegalNotices />} />
            <Route path="/data" element={<PersonalData />} />
            <Route path="/cookies" element={<CookiesPage />} />
          </Routes>
        </Layout>
        <Footer />
        <CookieConsent />
      </div>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}
