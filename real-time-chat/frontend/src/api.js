export const API_URL = import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:5000" : "");

export async function apiRequest(url, options) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "The chat backend is not connected. Deploy the backend, set the VITE_API_URL repository variable to its public URL, then redeploy GitHub Pages."
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The chat backend returned an invalid response. Check its deployment logs.");
  }

  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}
