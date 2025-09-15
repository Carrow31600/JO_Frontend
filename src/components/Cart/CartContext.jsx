import { createContext, useContext, useState, useEffect } from "react";

// Création du contexte panier
const CartContext = createContext();

// Provider qui donne accès au panier dans toute l'app.
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem('cart'); 
      return savedCart ? JSON.parse(savedCart) : [];       // Si panier existant, on le charge
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      return [];
    }
  });

  // Sauvegarde du panier dans le sessionStorage à chaque modification
  useEffect(() => {
    try {
      if (cart.length > 0) {
        sessionStorage.setItem('cart', JSON.stringify(cart));
      } else {
        sessionStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Erreur sauvegarde panier:', error);
    }
  }, [cart]);

  // Ajouter un article dans le panier
  const addToCart = (event, offer, quantity, sportsList, lieuxList) => {
    if (!event || !offer || !quantity || quantity <= 0) {
      console.error('Données invalides pour ajout au panier');
      return;
    }

     // Récupération du nom du sport et du lieu 
    const sportName = sportsList?.find(s => s.id === event.sport)?.nom || event.sport;
    const lieuName = lieuxList?.find(l => l.id === event.lieu)?.nom || event.lieu;

     // Création de l'objet représentant un article du panier
    const newItem = {
      eventId: event.id,
      eventDate: event.date,
      lieu: event.lieu,
      lieuName: lieuName,
      sport: event.sport,
      sportName: sportName,
      offerId: offer.id,
      offerName: offer.nom,
      price: offer.prix,
      quantity: quantity,
      total: quantity * parseFloat(offer.prix),
      addedAt: Date.now()
    };

    // Ajout de l'article au panier
    setCart(prevCart => [...prevCart, newItem]);
  };

  // Supprimer un article du panier
  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

   // Vider tout le panier
  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('cart');
  };

  // Calculer le total du panier
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

   // Calculer le nombre total d'articles dans le panier
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

   // Partage du panier et des fonctions aux composants enfants
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook  pour consommer le panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};
