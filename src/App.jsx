
import { Routes, Route, Link } from "react-router-dom"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import CartPage from "./pages/CartPage"

export default function App() {
  return (
    <div>
      {/*test */}
      <nav style={{ display: "flex", background: "#b8a8f1ff" }}>
        <Link to="/">Accueil</Link>
        <Link to="/login">Connexion</Link>
        <Link to="/cart">Panier</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  )
}
