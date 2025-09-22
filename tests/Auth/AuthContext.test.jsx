import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../../src/Auth/AuthContext";

// Composant de test qui consomme le contexte et expose les résultats
function TestComponent({ onLoginResult, onRegisterResult }) {
  const { login, logout, register } = useAuth();

  return (
    <div>
      <button
        onClick={async () => {
          const result = await login("user", "pass");
          onLoginResult?.(result);
        }}
      >
        Login
      </button>
      <button onClick={() => logout()}>Logout</button>
      <button
        onClick={async () => {
          const result = await register({ username: "toto", password: "123" });
          onRegisterResult?.(result);
        }}
      >
        Register
      </button>
    </div>
  );
}

// Helper pour rendre nos composants avec AuthProvider + Router
function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

// Nettoyage du mock fetch et du storage avant chaque test
beforeEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe("AuthContext avec AuthProvider", () => {
  it("login stocke les tokens quand API OK", async () => {
    // simulation réponse API valide
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access: "abc", refresh: "def" }),
      })
    );

    let loginResult;
    renderWithProviders(
      <TestComponent
        onLoginResult={(result) => {
          loginResult = result;
        }}
      />
    );

    // Clique sur Login et attend la mise à jour
    await act(async () => {
      fireEvent.click(screen.getByText("Login"));
    });

    // Vérifie que les tokens ont été stockés avec les bonnes clés
    expect(sessionStorage.getItem("access")).toBe("abc");
    expect(sessionStorage.getItem("refresh")).toBe("def");
    expect(loginResult).toBe(true);
  });

  it("login retourne false si API renvoie une erreur", async () => {
    // Réponse API KO
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: "Invalid credentials" }),
      })
    );

    let loginResult;
    renderWithProviders(
      <TestComponent
        onLoginResult={(result) => {
          loginResult = result;
        }}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Login"));
    });

    expect(loginResult).toBe(false);
    expect(sessionStorage.getItem("access")).toBe(null);
    expect(sessionStorage.getItem("refresh")).toBe(null);
  });

  it("logout supprime les tokens", async () => {
    // On met des tokens en sessionStorage avec les bonnes clés
    sessionStorage.setItem("access", "abc");
    sessionStorage.setItem("refresh", "def");

    renderWithProviders(<TestComponent />);

    // Clique sur Logout
    await act(async () => {
      fireEvent.click(screen.getByText("Logout"));
    });

    expect(sessionStorage.getItem("access")).toBe(null);
    expect(sessionStorage.getItem("refresh")).toBe(null);
  });

  it("register retourne true si API OK", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, username: "toto" }),
      })
    );

    let registerResult;
    renderWithProviders(
      <TestComponent
        onRegisterResult={(result) => {
          registerResult = result;
        }}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Register"));
    });

    expect(registerResult).toBe(true);
  });

  it("register retourne false si API échoue", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Bad request" }),
      })
    );

    let registerResult;
    renderWithProviders(
      <TestComponent
        onRegisterResult={(result) => {
          registerResult = result;
        }}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Register"));
    });

    expect(registerResult).toBe(false);
  });
});
