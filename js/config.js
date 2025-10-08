// Use local proxy during development to avoid CORS errors.
// The proxy forwards requests to the partner API and injects Access-Control-Allow-* headers.
export const API_BASE = "http://localhost:3000/api/definitions";

// For production / direct calls, you can switch to the partner URL:
// export const API_BASE = "https://dictionary-api-n9tx.onrender.com/api/definitions";