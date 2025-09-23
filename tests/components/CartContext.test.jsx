// tests/components/CartContext.test.jsx
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../src/components/Cart/CartContext.jsx";

describe("CartProvider", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const mockEvent = { id: 1, date: "2025-09-23", sport: 10, lieu: 100 };
  const mockOffer = { id: "A1", nom: "Billet test", prix: 10 };
  const sportsList = [{ id: 10, nom: "Natation" }];
  const lieuxList = [{ id: 100, nom: "Stade Aquatique" }];

  it("devrait initialiser le panier vide", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.cart).toEqual([]);
  });

  it("devrait ajouter un article au panier", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(mockEvent, mockOffer, 1, sportsList, lieuxList);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].eventId).toBe(1);
    expect(result.current.cart[0].offerName).toBe("Billet test");
    expect(result.current.cart[0].quantity).toBe(1);
  });

  it("devrait supprimer un article du panier", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(mockEvent, mockOffer, 1, sportsList, lieuxList);
      result.current.addToCart(mockEvent, mockOffer, 1, sportsList, lieuxList);
    });

    expect(result.current.cart).toHaveLength(2);

    act(() => {
      result.current.removeFromCart(0);
    });

    expect(result.current.cart).toHaveLength(1);
  });

  it("devrait vider le panier avec clearCart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(mockEvent, mockOffer, 1, sportsList, lieuxList);
      result.current.addToCart(
        { ...mockEvent, id: 2 },
        { ...mockOffer, id: "B2", nom: "Billet B", prix: 20 },
        1,
        sportsList,
        lieuxList
      );
    });

    expect(result.current.cart).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("devrait calculer correctement le total et le nombre d'articles", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(mockEvent, mockOffer, 2, sportsList, lieuxList);
      result.current.addToCart(
        { ...mockEvent, id: 2 },
        { ...mockOffer, id: "B2", nom: "Billet B", prix: 5 },
        3,
        sportsList,
        lieuxList
      );
    });

    expect(result.current.getCartItemsCount()).toBe(5); // 2 + 3
    expect(result.current.getCartTotal()).toBe(35); // (2*10 + 3*5)
  });
});
