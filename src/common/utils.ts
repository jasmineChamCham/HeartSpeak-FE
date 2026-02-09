export function clearLocalStorage() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function extractAnalysisText(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }
  return (data as any)?.summary || JSON.stringify(data);
}
