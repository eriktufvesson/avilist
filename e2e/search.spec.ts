import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows app title", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Svenska fågelnamn");
});

test("shows subtitle", async ({ page }) => {
  await expect(page.getByText("Officiella svenska namn på världens fågelarter")).toBeVisible();
});

test("search input is focused on load", async ({ page }) => {
  await expect(page.getByRole("searchbox")).toBeFocused();
});

test("shows results after searching", async ({ page }) => {
  await page.getByRole("searchbox").fill("struts");
  await expect(page.getByRole("list")).toBeVisible();
  await expect(page.getByRole("button").first()).toBeVisible();
});

test("shows result count badge", async ({ page }) => {
  await page.getByRole("searchbox").fill("struts");
  await expect(page.getByText(/träffar/)).toBeVisible();
});

test("shows no-results message for unrecognised query", async ({ page }) => {
  await page.getByRole("searchbox").fill("xyzxyzxyz");
  await expect(page.getByText(/Inga arter hittades/)).toBeVisible();
});

test("shows Swedish, English and scientific names in results", async ({ page }) => {
  await page.getByRole("searchbox").fill("struts");
  const firstResult = page.getByRole("button").first();
  await expect(firstResult.locator(".swedish-name")).toBeVisible();
  await expect(firstResult.locator(".english-name")).toBeVisible();
  await expect(firstResult.locator(".scientific-name")).toBeVisible();
});

test("shows footer with species count", async ({ page }) => {
  await expect(page.getByText(/arter · NL v2025/)).toBeVisible();
});
