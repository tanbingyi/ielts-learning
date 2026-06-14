import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), "data", "dictionary.db");

  if (!fs.existsSync(dbPath)) {
    console.warn("Dictionary database not found at", dbPath);
    db = new Database(":memory:");
    db.exec("CREATE TABLE dictionary (word TEXT PRIMARY KEY, translation TEXT)");
    return db;
  }

  db = new Database(dbPath, { readonly: true });
  return db;
}

const stmtCache = new Map<string, Database.Statement>();

function getStmt(sql: string): Database.Statement {
  const cached = stmtCache.get(sql);
  if (cached) return cached;
  const stmt = getDb().prepare(sql);
  stmtCache.set(sql, stmt);
  return stmt;
}

function tryLookup(word: string): string | null {
  const row = getStmt("SELECT translation FROM dictionary WHERE word = ?").get(word) as
    | { translation: string }
    | undefined;
  return row?.translation ?? null;
}

export function lookupWord(word: string): string | null {
  let cleaned = word.toLowerCase().replace(/[^a-z'-]/g, "");
  if (!cleaned || cleaned.length < 2) return null;

  // strip leading/trailing apostrophes and dashes
  cleaned = cleaned.replace(/^['-]+|['-]+$/g, "");

  // exact match first
  const exact = tryLookup(cleaned);
  if (exact) return exact;

  // try stripping trailing 's (possessive/plural)
  if (cleaned.endsWith("'s")) {
    const withoutS = tryLookup(cleaned.slice(0, -2));
    if (withoutS) return withoutS;
  }

  return null;
}

export function getDictionarySize(): number {
  const row = getStmt("SELECT COUNT(*) as cnt FROM dictionary").get() as
    | { cnt: number }
    | undefined;
  return row?.cnt ?? 0;
}
