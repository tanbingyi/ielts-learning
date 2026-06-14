import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import readline from "readline";

const CSV_PATH = path.join(process.cwd(), "data", "ecdict.csv");
const DB_PATH = path.join(process.cwd(), "data", "dictionary.db");

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function parseExchange(exchange: string): string[] {
  if (!exchange) return [];
  const forms: string[] = [];
  const parts = exchange.split("/");
  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx > 0) {
      const value = part.substring(colonIdx + 1);
      if (value && /^[a-zA-Z]/.test(value)) {
        forms.push(value.trim().toLowerCase());
      }
    }
  }
  return forms;
}

async function main() {
  console.log("Building dictionary database from ECDICT CSV...");

  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV file not found at", CSV_PATH);
    process.exit(1);
  }

  const fileSize = fs.statSync(CSV_PATH).size;
  console.log(`CSV file size: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);

  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  const db = new Database(DB_PATH);

  db.exec("PRAGMA journal_mode = OFF");
  db.exec("PRAGMA synchronous = OFF");
  db.exec("PRAGMA cache_size = -64000");
  db.exec("CREATE TABLE dictionary (word TEXT PRIMARY KEY, translation TEXT) WITHOUT ROWID");

  const insertStmt = db.prepare(
    "INSERT OR IGNORE INTO dictionary (word, translation) VALUES (?, ?)"
  );

  const fileStream = fs.createReadStream(CSV_PATH, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineCount = 0;
  let inserted = 0;
  let skipped = 0;
  let headerParsed = false;

  const doInsert = db.transaction(
    (items: { word: string; translation: string }[]) => {
      for (const item of items) {
        insertStmt.run(item.word, item.translation);
      }
    }
  );

  let batch: { word: string; translation: string }[] = [];
  const BATCH_SIZE = 5000;
  let bytesRead = 0;

  for await (const line of rl) {
    bytesRead += Buffer.byteLength(line, "utf-8") + 1;
    lineCount++;

    if (!headerParsed) {
      headerParsed = true;
      continue;
    }

    if (lineCount % 100000 === 0) {
      const pct = ((bytesRead / fileSize) * 100).toFixed(1);
      console.log(`  processed ${lineCount} lines (${pct}%), inserted ${inserted} so far...`);
    }

    const fields = parseCSVLine(line);
    if (fields.length < 4) continue;

    const word = fields[0]?.trim().toLowerCase();
    const translation = fields[3]?.trim();
    const exchange = fields[10]?.trim() || "";

    if (!word || !translation || word.includes(" ")) {
      skipped++;
      continue;
    }

    batch.push({ word, translation });

    const altForms = parseExchange(exchange);
    for (const form of altForms) {
      if (form && form !== word && !form.includes(" ")) {
        batch.push({ word: form, translation });
      }
    }

    if (batch.length >= BATCH_SIZE) {
      doInsert(batch);
      inserted += batch.length;
      batch = [];
    }
  }

  if (batch.length > 0) {
    doInsert(batch);
    inserted += batch.length;
  }

  console.log(`Creating index...`);
  db.exec("CREATE INDEX idx_word ON dictionary(word)");

  const dbSize = fs.statSync(DB_PATH).size;
  console.log("");
  console.log(`Done!`);
  console.log(`  Lines processed: ${lineCount}`);
  console.log(`  Entries inserted: ${inserted}`);
  console.log(`  Skipped (no translation): ${skipped}`);
  console.log(`  Database size: ${(dbSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Database at: ${DB_PATH}`);

  db.close();
}

main().catch(console.error);
