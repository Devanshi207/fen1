import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CareersSection from "@/components/sections/CareersSection";
import OpenRoles, { loadOpenRoles, type OpenRole } from "@/components/sections/OpenRoles";

const role: OpenRole = { id: "r1", title: "Estimator, aluminium systems", area: "Estimating", location: "Pune", type: "Full-time", summary: "Price window packages.", details: "First paragraph.\n\nSecond paragraph." };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("loadOpenRoles", () => {
  it("returns the roles the endpoint sends, asking fresh each time", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [role] }) });
    vi.stubGlobal("fetch", fetchMock);
    expect(await loadOpenRoles()).toEqual([role]);
    expect(fetchMock).toHaveBeenCalledWith("/api/jobs", { cache: "no-store" });
  });
  it("returns an empty list when the request fails or the answer is odd", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await loadOpenRoles()).toEqual([]);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect(await loadOpenRoles()).toEqual([]);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: "nope" }) }));
    expect(await loadOpenRoles()).toEqual([]);
  });
});

describe("OpenRoles", () => {
  it("renders nothing without roles", () => {
    const { container } = render(<OpenRoles roles={[]} onApply={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists a role with its details in the open, and applies with the role", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<OpenRoles roles={[role]} onApply={onApply} />);
    expect(screen.getByRole("heading", { name: role.title })).toBeInTheDocument();
    expect(screen.getByText("Estimating · Pune · Full-time")).toBeInTheDocument();
    expect(screen.queryByText("First paragraph.")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Read more" }));
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /apply/i }));
    expect(onApply).toHaveBeenCalledWith(role);
  });
});

describe("Careers with published roles", () => {
  it("shows the roles, then pre-fills the form when one is applied for", async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [role] }) }));
    const user = userEvent.setup();
    render(<CareersSection />);
    expect(await screen.findByRole("heading", { name: role.title })).toBeInTheDocument();
    expect(screen.queryByText(/No roles are listed here right now/)).toBeNull();
    await user.click(screen.getByRole("button", { name: /apply/i }));
    await waitFor(() => expect(screen.getByLabelText(/applying for/i)).toHaveValue(role.title));
    expect(screen.queryByLabelText(/where you could help/i)).toBeNull();
  });
});
