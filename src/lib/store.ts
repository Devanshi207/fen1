import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Where job openings and enquiries are saved. Two places, chosen by what is configured:
 *  - Upstash Redis over its REST API (UPSTASH_REDIS_REST_URL / _TOKEN, or the KV_REST_API_URL / _TOKEN names Vercel adds).
 *    This is what a deployed site uses, because Vercel has no writable disk. No extra package: it is plain fetch.
 *  - A JSON file in .data/ (or FEN1_DATA_FILE) for local development.
 * With neither (a deployed site without a database) getStore() returns null and callers say so; nothing pretends to save.
 * Each record is saved on its own (a Redis hash field), so two enquiries arriving together cannot overwrite each other.
 */
export type Collection = "jobs" | "enquiries" | "settings";
export type Record_ = Record<string, unknown>;

export interface Store {
  readonly kind: "redis" | "file";
  all(collection: Collection): Promise<Record_[]>;
  get(collection: Collection, id: string): Promise<Record_ | null>;
  put(collection: Collection, id: string, value: Record_): Promise<void>;
  del(collection: Collection, id: string): Promise<boolean>;
}

/* ---------- Redis (REST) ---------- */
function redisStore(url: string, token: string): Store {
  const key = (c: Collection) => `fen1:${c}`;
  async function run(args: (string | number)[]): Promise<unknown> {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { result?: unknown; error?: string };
    if (!res.ok || json.error) throw new Error(`Redis ${args[0]} failed: ${json.error ?? res.status}`);
    return json.result;
  }
  const parse = (raw: unknown): Record_ | null => {
    if (typeof raw !== "string") return null;
    try {
      return JSON.parse(raw) as Record_;
    } catch {
      return null;
    }
  };
  return {
    kind: "redis",
    async all(c) {
      const flat = (await run(["HGETALL", key(c)])) as unknown;
      const out: Record_[] = [];
      if (Array.isArray(flat)) for (let i = 1; i < flat.length; i += 2) {
        const v = parse(flat[i]);
        if (v) out.push(v);
      }
      return out;
    },
    async get(c, id) {
      return parse(await run(["HGET", key(c), id]));
    },
    async put(c, id, value) {
      await run(["HSET", key(c), id, JSON.stringify(value)]);
    },
    async del(c, id) {
      return Number(await run(["HDEL", key(c), id])) > 0;
    },
  };
}

/* ---------- JSON file (development) ---------- */
type FileData = Record<Collection, Record<string, Record_>>;

function fileStore(file: string): Store {
  // writes go through one queue, so overlapping requests cannot corrupt the file
  let queue: Promise<unknown> = Promise.resolve();
  async function read(): Promise<FileData> {
    try {
      const data = JSON.parse(await fs.readFile(file, "utf8")) as Partial<FileData>;
      return { jobs: data.jobs ?? {}, enquiries: data.enquiries ?? {}, settings: data.settings ?? {} };
    } catch {
      return { jobs: {}, enquiries: {}, settings: {} };
    }
  }
  function change<T>(fn: (data: FileData) => T): Promise<T> {
    const run = queue.then(async () => {
      const data = await read();
      const result = fn(data);
      await fs.mkdir(path.dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
      await fs.rename(tmp, file);
      return result;
    });
    queue = run.catch(() => undefined);
    return run;
  }
  return {
    kind: "file",
    async all(c) {
      return Object.values((await read())[c]);
    },
    async get(c, id) {
      return (await read())[c][id] ?? null;
    },
    async put(c, id, value) {
      await change((d) => {
        d[c][id] = value;
      });
    },
    async del(c, id) {
      return change((d) => {
        const had = id in d[c];
        delete d[c][id];
        return had;
      });
    },
  };
}

/** The configured store, or null when the site has nowhere it can save to. */
export function getStore(): Store | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return redisStore(url, token);
  const file = process.env.FEN1_DATA_FILE;
  if (file) return fileStore(file);
  // Vercel's disk is read-only, so a file cannot be used there
  if (process.env.VERCEL) return null;
  return fileStore(path.join(process.cwd(), ".data", "fen1.json"));
}

export { redisStore as _redisStoreForTests, fileStore as _fileStoreForTests };
