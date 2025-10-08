import { STR } from "./strings.js";
import { isValidWord, isValidDefinition } from "./validation.js";
import { createDefinition, getDefinition } from "./api.js";


class PageController {
  constructor(title) {
    document.title = title;
  }

  setOutput(element, message, type = "info") {
    element.textContent = message;
    element.className = "alert";
    element.classList.remove("d-none", "alert-success", "alert-danger", "alert-warning", "alert-info");
    element.classList.add(`alert-${type}`);
  }

  buildResponseMessage(data, baseMessage) {
    const req = data?.requestCount != null ? ` • ${STR.reqCount(data.requestCount)}` : "";
    const ent = data?.entryCount != null ? ` • ${STR.entryCount(data.entryCount)}` : "";
    return `${baseMessage}${req}${ent}`;
  }
}

class StorePageController extends PageController {
  constructor() {
    super(STR.storeTitle);
    this.form = document.getElementById("storeForm");
    this.wordEl = document.getElementById("word");
    this.defEl = document.getElementById("definition");
    this.outEl = document.getElementById("output");
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const word = this.wordEl.value;
    const def = this.defEl.value;

    if (!isValidWord(word)) {
      return this.setOutput(this.outEl, STR.invalidWord, "warning");
    }
    if (!isValidDefinition(def)) {
      return this.setOutput(this.outEl, STR.invalidDef, "warning");
    }

    try {
      const { ok, status, data } = await createDefinition(word.trim(), def.trim());

      if (!ok) {
        // If server provided a JSON message, show it (use warning for conflict)
        const serverMsg = data?.message ?? STR.serverErr;
        const alertType = status === 409 ? "warning" : "danger";
        return this.setOutput(this.outEl, this.buildResponseMessage(data, serverMsg), alertType);
      }

      const msg = data?.message ?? (data?.exists ? STR.alreadyExists : STR.successSave);
      const alertType = data?.exists ? "warning" : "success";
      this.setOutput(this.outEl, this.buildResponseMessage(data, msg), alertType);
    } catch (err) {
      // Network or unexpected error
      this.setOutput(this.outEl, `${STR.serverErr} (${err?.message ?? ""})`, "danger");
    }
  }
}

class SearchPageController extends PageController {
  constructor() {
    super(STR.searchTitle);
    this.form = document.getElementById("searchForm");
    this.qEl = document.getElementById("query");
    this.outEl = document.getElementById("result");
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const q = this.qEl.value;

    if (!isValidWord(q)) {
      return this.setOutput(this.outEl, STR.invalidWord, "warning");
    }

    try {
      const { ok, status, data } = await getDefinition(q.trim());

      if (!ok) {
        // Prefer server-provided message when available
        const serverMsg = data?.message ?? STR.notFound;
        // Show HTTP status and a raw JSON preview to make debugging easier in the UI
        const rawJson = data ? ` ${JSON.stringify(data)}` : "";
        return this.setOutput(
          this.outEl,
          this.buildResponseMessage(data, `${serverMsg} (HTTP ${status})${rawJson}`),
          "warning"
        );
      }

      const message = `${data.word}: ${data.definition}`;
      this.setOutput(this.outEl, this.buildResponseMessage(data, message), "success");
    } catch (err) {
      // Include the underlying error message when available to aid debugging (e.g. CORS/mixed-content)
      const errMsg = err?.message ?? '';
      this.setOutput(this.outEl, `${STR.serverErr}${errMsg ? ` (${errMsg})` : ''}`, "danger");
    }
  }
}

export function wireStorePage() {
  const controller = new StorePageController();
  controller.init();
}

export function wireSearchPage() {
  const controller = new SearchPageController();
  controller.init();
}
