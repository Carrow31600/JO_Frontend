import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccountPage from "../../src/pages/AccountPage";
import { vi } from "vitest";
import { useAuth } from "../../src/Auth/AuthContext";

// Mock du AuthContext
vi.mock("../../src/Auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock du useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche 'Chargement...' si user est null", () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("affiche les infos du user quand il est connecté", () => {
    useAuth.mockReturnValue({
      user: { username: "jdoe", first_name: "John", email: "john@example.com" },
      deleteAccount: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    expect(screen.getByText("jdoe")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("navigue vers la page d'édition quand on clique sur Modifier", () => {
    useAuth.mockReturnValue({
      user: { username: "jdoe", first_name: "John", email: "john@example.com" },
      deleteAccount: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Modifier le compte"));

    expect(mockNavigate).toHaveBeenCalledWith("/account/update");
  });

  it("supprime le compte si confirm est accepté", async () => {
    const mockDelete = vi.fn().mockResolvedValue(true);
    useAuth.mockReturnValue({
      user: { username: "jdoe", first_name: "John", email: "john@example.com" },
      deleteAccount: mockDelete,
    });

    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Supprimer le compte"));

    // attendre que mockNavigate soit appelé
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("n'appelle pas deleteAccount si confirm est annulé", () => {
    const mockDelete = vi.fn();
    useAuth.mockReturnValue({
      user: { username: "jdoe", first_name: "John", email: "john@example.com" },
      deleteAccount: mockDelete,
    });

    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Supprimer le compte"));

    expect(mockDelete).not.toHaveBeenCalled();
  });
});
