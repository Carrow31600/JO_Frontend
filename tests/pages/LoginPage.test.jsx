// tests/pages/LoginPage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "../../src/pages/LoginPage.jsx";

// Mocks globaux
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../src/Auth/AuthContext.jsx", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  test("affiche le formulaire initial", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
  });

  test("connexion réussie -> redirection", async () => {
    mockLogin.mockResolvedValueOnce(true);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), { target: { value: "john" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "doe" } });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("john", "doe");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("connexion échouée -> message d'erreur", async () => {
    mockLogin.mockResolvedValueOnce(false);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), { target: { value: "wrong" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByText(/identifiants invalides/i)).toBeInTheDocument();
  });

  test("erreur login -> message d'erreur générique", async () => {
    mockLogin.mockRejectedValueOnce(new Error("network error"));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), { target: { value: "x" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "y" } });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByText(/erreur de connexion/i)).toBeInTheDocument();
  });

  test("le bouton est désactivé pendant le chargement", async () => {
    let resolveLogin;
    mockLogin.mockImplementation(
      () => new Promise((res) => (resolveLogin = res))
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), { target: { value: "x" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "y" } });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent(/connexion.../i);

    resolveLogin(false);
    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });
});
