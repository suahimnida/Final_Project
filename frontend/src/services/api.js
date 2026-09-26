const API_BASE_URL = "http://localhost:8000";

export async function analyzeUrl(url) {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
  });

  if (!response.ok) {
    throw new Error("URL 분석 요청에 실패했습니다.");
  }

  return response.json();
}