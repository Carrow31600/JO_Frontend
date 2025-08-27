import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      return [];
    }
  });

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

  const addToCart = (event, offer, quantity, sportsList, lieuxList) => {
    if (!event || !offer || !quantity || quantity <= 0) {
      console.error('Données invalides pour ajout au panier');
      return;
    }


    const sportName = sportsList?.find(s => s.id === event.sport)?.nom || event.sport;
    const lieuName = lieuxList?.find(l => l.id === event.lieu)?.nom || event.lieu;

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

    setCart(prevCart => [...prevCart, newItem]);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};
