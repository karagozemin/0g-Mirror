import fs from "node:fs";
import { chromium } from "playwright";

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = "docs/screenshots";

fs.mkdirSync(OUT_DIR, { recursive: true });

async function waitForText(page, text, timeout = 180_000) {
  await page.waitForFunction(
    (needle) => document.body.innerText.toLowerCase().includes(String(needle).toLowerCase()),
    text,
    { timeout }
  );
}

async function clickButton(page, name, timeout = 180_000) {
  const button = page.getByRole("button", { name });
  await button.waitFor({ state: "visible", timeout });
  await button.click({ timeout });
}

async function screenshot(page, name, options = {}) {
  const path = `${OUT_DIR}/${name}.png`;
  await page.screenshot({ path, fullPage: false, ...options });
  console.log(`saved ${path}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  page.setDefaultTimeout(180_000);

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await screenshot(page, "01-landing");

  await page.goto(`${BASE_URL}/mirror`, { waitUntil: "networkidle" });
  await clickButton(page, "Run Decision");
  await waitForText(page, "Decision hash");
  await screenshot(page, "02-mirror-decision-trace");

  await clickButton(page, "Store on 0G");
  await waitForText(page, "0g://");
  await screenshot(page, "03-mirror-storage-uri");

  await clickButton(page, "Register On-chain");
  await page.waitForFunction(
    () => /on-chain trace id\s+\d+/i.test(document.body.innerText),
    undefined,
    { timeout: 180_000 }
  );

  await clickButton(page, "Verify Decision");
  await waitForText(page, "Replay matched");
  await screenshot(page, "04-mirror-verified");

  await page.goto(`${BASE_URL}/arena`, { waitUntil: "networkidle" });
  await clickButton(page, "Start Battle");
  await waitForText(page, "Aegis");
  await waitForText(page, "Nyx");
  await screenshot(page, "05-arena-aegis-vs-nyx");

  await clickButton(page, "Verify Both");
  await waitForText(page, "Both decisions replayed.");
  await clickButton(page, "Appeal to Olympus");
  await waitForText(page, "Olympus Court Verdict");
  await waitForText(page, "Winner");
  await page.getByText("Olympus Court Verdict").scrollIntoViewIfNeeded();
  await screenshot(page, "06-olympus-verdict-card");

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
