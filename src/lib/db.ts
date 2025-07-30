import { neon } from "@neondatabase/serverless";
import fetch, { Request, Response, Headers } from "node-fetch";

export const runtime = "nodejs";

if (!globalThis.fetch) {
    globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
    globalThis.Request = Request as unknown as typeof globalThis.Request;
    globalThis.Response = Response as unknown as typeof globalThis.Response;
    globalThis.Headers = Headers as unknown as typeof globalThis.Headers;
}

export async function getDBConnection() {
    if (!process.env.DATABASE_URL){
        throw new Error("Neon Database URL is not defined");
    }
    const sql = neon(process.env.DATABASE_URL);
    return sql;
}