/**
 * Converts NL20.xlsx (Official Swedish bird names) to src/birds.json
 * Run with: node scripts/convert-excel.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Dynamically import xlsx (install with: npm install xlsx)
const XLSX = (await import("xlsx")).default;

const workbook = XLSX.readFile(join(root, "data", "NL20.xlsx"));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

// Row 0-1: titles, Row 2: headers, Row 3+: data
const DATA_START = 3;

const birds = [];
let currentOrder = "";
let currentFamily = "";

for (let i = DATA_START; i < rows.length; i++) {
  const [nr, niva, scientific, english, swedish, extinct] = rows[i];

  if (!niva) continue;

  if (niva === "ordning") {
    currentOrder = swedish ?? scientific ?? "";
    continue;
  }
  if (niva === "familj") {
    currentFamily = swedish ?? english ?? scientific ?? "";
    continue;
  }
  if (niva === "art" && scientific) {
    birds.push({
      nr: nr ?? i,
      scientific: scientific.trim(),
      english: english ? english.trim() : "",
      swedish: swedish ? swedish.trim() : "",
      extinct: extinct === "†",
      order: currentOrder,
      family: currentFamily,
    });
  }
}

const outPath = join(root, "src", "birds.json");
writeFileSync(outPath, JSON.stringify(birds, null, 2), "utf8");
console.log(`✓ Wrote ${birds.length} species to src/birds.json`);
