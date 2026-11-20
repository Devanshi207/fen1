import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApplySection from "@/components/sections/ApplySection";
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
    const { container } = render(<OpenRoles roles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists a role with its details in the open, and Apply is a link to that role's own application page", async () => {
    const user = userEvent.setup();
    render(<OpenRoles roles={[role]} />);
    expect(screen.getByRole("heading", { name: role.title })).toBeInTheDocument();
    expect(screen.getByText("Estimating · Pune · Full-time")).toBeInTheDocument();
    expect(screen.queryByText("First paragraph.")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Read more" }));
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apply/i })).toHaveAttribute("href", "/careers/apply?role=r1");
  });
});

describe("Careers with published roles", () => {
  it("lists the roles with an Apply link and no form on the page", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [role] }) }));
    render(<CareersSection />);
    expect(await screen.findByRole("heading", { name: role.title })).toBeInTheDocument();
    expect(screen.queryByText(/No openings right now/)).toBeNull();
    expect(screen.getByRole("link", { name: /apply/i })).toHaveAttribute("href", "/careers/apply?role=r1");
    expect(screen.queryByLabelText(/your name/i)).toBeNull();
  });
});

describe("The apply page", () => {
  it("opens the form for the opening named in the address, across the page", async () => {
    window.history.replaceState(null, "", "/careers/apply?role=r1");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [role] }) }));
    render(<ApplySection />);
    expect(await screen.findByRole("heading", { level: 1, name: `Apply for ${role.title}` })).toBeInTheDocument();
    expect(screen.getByText(`Applying for: ${role.title}`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /all openings/i })).toHaveAttribute("href", "/careers");
    expect(screen.queryByText(/Question \d of \d/)).toBeNull();
    expect(document.querySelector(".apply-form .wiz")).not.toBeNull();
  });

  it("says so when the opening is unknown or has been closed", async () => {
    window.history.replaceState(null, "", "/careers/apply?role=gone");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [role] }) }));
    render(<ApplySection />);
    expect(await screen.findByRole("heading", { name: "This opening is no longer available" })).toBeInTheDocument();
    expect(screen.queryByLabelText(/your name/i)).toBeNull();
  });
});
