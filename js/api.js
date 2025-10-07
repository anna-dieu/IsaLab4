import { API_BASE } from "./config.js";

class DefinitionAPI {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async #fetchJSON(url, options = {}) {
    const res = await fetch(url, { mode: "cors", ...options });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  }

  // GET /api/definitions/?word=book
  async getDefinition(word) {
    const url = `${this.baseUrl}/?word=${encodeURIComponent(word)}`;
    return this.#fetchJSON(url, { method: "GET" });
  }

  // POST /api/definitions body: { word, definition }
  async createDefinition(word, definition) {
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
