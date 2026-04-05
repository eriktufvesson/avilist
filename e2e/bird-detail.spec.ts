import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("struts");
  await expect(page.getByRole("button").first()).toBeVisible();
});

test("opens detail panel when clicking a result", async ({ page }) => {
  await page.getByRole("button").first().click();
  await expect(page.locator(".detail-panel")).toBeVisible();
});

test("detail panel shows Swedish and scientific names", async ({ page }) => {
  await page.getByRole("button").first().click();
  await expect(page.locator(".detail-swedish")).toBeVisible();
  await expect(page.locator(".detail-scientific")).toBeVisible();
});

test("detail panel shows field labels", async ({ page }) => {
  await page.getByRole("button").first().click();
  await expect(page.getByText("Engelska")).toBeVisible();
  await expect(page.getByText("Familj")).toBeVisible();
  await expect(page.getByText("NL-nummer")).toBeVisible();
});

test("closes detail panel via Escape key", async ({ page }) => {
  await page.getByRole("button").first().click();
  await expect(page.locator(".detail-panel")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".detail-panel")).not.toBeVisible();
});

test("closes detail panel via close button", async ({ page }) => {
  await page.getByRole("button").first().click();
  await expect(page.locator(".detail-panel")).toBeVisible();
  await page.getByLabel("Stäng").click();
  await expect(page.locator(".detail-panel")).not.toBeVisible();
});

test("closes detail panel by clicking the overlay backdrop", async ({ page }) => {
  await page.getByRole("button").first().click();
  await expect(page.locator(".detail-panel")).toBeVisible();
  // Click at the very top-left of viewport — outside the panel, on the overlay
  await page.mouse.click(10, 10);
  await expect(page.locator(".detail-panel")).not.toBeVisible();
});

test("can open a second result after closing the first", async ({ page }) => {
  const buttons = page.getByRole("button");
  await buttons.nth(0).click();
  await page.getByLabel("Stäng").click();
  await expect(page.locator(".detail-panel")).not.toBeVisible();
  await buttons.nth(1).click();
  await expect(page.locator(".detail-panel")).toBeVisible();
});
