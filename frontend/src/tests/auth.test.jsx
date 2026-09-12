import { vi, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/auth";
import * as authService from "../services/auth.service";
vi.mock("../services/auth.service", () => ({
  getMe: vi.fn(),
  logout: vi.fn(),
}));
function Consumer() {
  const { user, loading, error, retry } = useAuth();
  return (
    <>
      <p>{loading ? "Loading" : user ? user.email : "Sign in"}</p>
      {error && <button onClick={retry}>Retry connection</button>}
    </>
  );
}
beforeEach(() => vi.resetAllMocks());
it("recovers from an expired session and removes legacy tokens", async () => {
  localStorage.setItem("token", "legacy-token");
  authService.getMe.mockRejectedValue({ response: { status: 401 } });
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  );
  expect(await screen.findByText("Sign in")).toBeInTheDocument();
  expect(screen.queryByText("Retry connection")).not.toBeInTheDocument();
  expect(localStorage.getItem("token")).toBeNull();
});
it("lets users retry a temporary failure without discarding the cookie session", async () => {
  authService.getMe
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ email: "test@example.com" });
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  );
  fireEvent.click(await screen.findByText("Retry connection"));
  await waitFor(() =>
    expect(screen.getByText("test@example.com")).toBeInTheDocument(),
  );
});
