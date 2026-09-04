import { expect, test } from "@playwright/test";

async function addFirstProduct(page: import("@playwright/test").Page) {
  await page.goto("/#boilies-de-nadit");
  const addButton = page.locator("#boilies-de-nadit").getByRole("button", { name: "Adaugă în coș" }).first();
  await addButton.scrollIntoViewIfNeeded();
  await addButton.click({ force: true });
}

test("homepage loads with brand heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Făcut pentru apă");
  await expect(page.getByRole("link", { name: "OBL Fishing — acasă" }).first()).toBeVisible();
});

test("navigation reaches category anchors", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Categorii" }).getByRole("link", { name: "Boilies de nădit" }).click();
  await expect(page.locator("#boilies-de-nadit")).toBeVisible();
});

test("product size and type selectors update the chosen variant", async ({ page }) => {
  await page.goto("/#boilies-de-nadit");
  const firstProduct = page.locator("#boilies-de-nadit article").first();
  await firstProduct.getByRole("radio", { name: "20 mm" }).click();
  await expect(firstProduct.getByRole("radio", { name: "20 mm" })).toBeChecked();
  await firstProduct.getByRole("radio", { name: "Solubile" }).click();
  await expect(firstProduct.getByRole("radio", { name: "Solubile" })).toBeChecked();
  await firstProduct.getByRole("button", { name: "Crește cantitatea" }).click();
  await expect(firstProduct.getByLabel("Cantitate 2")).toBeVisible();
});

test("adds a product, persists after reload and updates quantity", async ({ page }) => {
  await addFirstProduct(page);
  await expect(page.getByText("Produs adăugat în coș.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Coș/ })).toContainText("(1)");
  await page.getByRole("button", { name: /Coș/ }).click();
  await expect(page.getByRole("heading", { name: "Coșul tău" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /Coș/ }).click();
  const drawer = page.getByRole("dialog", { name: "Coșul tău" });
  await expect(drawer.getByRole("heading", { name: "OBL Squid & Strawberry" })).toBeVisible();
  await drawer.getByRole("button", { name: "Crește cantitatea" }).click();
  await expect(drawer.getByText("64 lei").first()).toBeVisible();
});

test("checkout validates and switches pickup/delivery fields", async ({ page }) => {
  await page.route("https://formsubmit.co/ajax/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.goto("/finalizare-comanda");
  await expect(page.getByRole("heading", { name: "Coșul este încă gol." })).toBeVisible();

  await addFirstProduct(page);
  await page.goto("/finalizare-comanda");
  await expect(page.getByRole("heading", { name: "Finalizare comandă" })).toBeVisible();
  await page.getByRole("button", { name: "Pregătește comanda" }).click();
  await expect(page.getByText("Introdu numele.")).toBeVisible();

  await expect(page.getByLabel("Județ")).toHaveCount(0);
  await page.getByRole("button", { name: "Livrare" }).click();
  await expect(page.getByLabel("Județ")).toBeVisible();
  await page.getByRole("button", { name: "Ridicare personală" }).click();
  await expect(page.getByLabel("Județ")).toHaveCount(0);

  await page.locator('input[name="lastName"]').fill("Badici");
  await page.locator('input[name="firstName"]').fill("Rares");
  await page.locator('input[name="phone"]').fill("0728 241 412");
  await page.getByRole("button", { name: "Pregătește comanda" }).click();
  await expect(page.getByText("Comanda este pregătită")).toBeVisible();
  const whatsapp = page.getByRole("link", { name: "Trimite pe WhatsApp" });
  await expect(whatsapp).toHaveAttribute("href", /https:\/\/wa\.me\/40728241412\?text=/);
  await expect(whatsapp).toHaveAttribute("href", /OBL-/);
});

test("legal routes and 404", async ({ page }) => {
  await page.goto("/politica-confidentialitate");
  await expect(page.getByRole("heading", { name: "Politica de confidențialitate" })).toBeVisible();
  await page.goto("/termeni-si-conditii");
  await expect(page.getByRole("heading", { name: "Termeni și condiții" })).toBeVisible();
  await page.goto("/pagina-care-nu-exista");
  await expect(page.getByRole("heading", { name: "Se pare că ai aruncat în afara vadului." })).toBeVisible();
});

test("mobile navbar opens category links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Deschide meniul" }).click();
  await expect(page.getByRole("navigation", { name: "Meniu mobil" })).toBeVisible();
  await page.getByRole("navigation", { name: "Meniu mobil" }).getByRole("link", { name: "Accesorii" }).click();
  await expect(page.locator("#accesorii")).toBeVisible();
});
