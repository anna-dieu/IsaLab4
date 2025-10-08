import { API_BASE } from "./config.js";

class DefinitionAPI {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async #fetchJSON(url, options = {}) {
    try {
      const res = await fetch(url, { mode: "cors", ...options });
      const data = await res.json().catch(() => null);
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      // Network error or CORS failure — return structured error instead of throwing
      return { ok: false, status: 0, data: { message: err?.message ?? "Network error" }, error: err };
    }
  }

  // GET /api/definitions/?word=book
  async getDefinition(word) {
    // Build URL using the URL API to handle trailing slashes robustly
    const urlObj = new URL(this.baseUrl);
    urlObj.searchParams.set("word", word);
    console.log(`Full URL: ${urlObj.href}`); // e.g. "http://localhost:3000/api/definitions/?word=book"
    return this.#fetchJSON(urlObj.href, { method: "GET" });
  }

  // POST /api/definitions body: { word, definition }
  async createDefinition(word, definition) {
    // Log the POST target for debugging
    console.log(`POST URL: ${this.baseUrl}`);
    return this.#fetchJSON(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, definition })
    });
  }
}

export const definitionAPI = new DefinitionAPI();
export const getDefinition = (word) => definitionAPI.getDefinition(word);
export const createDefinition = (word, definition) => definitionAPI.createDefinition(word, definition);
