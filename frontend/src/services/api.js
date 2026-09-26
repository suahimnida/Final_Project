const API_BASE_URL = "http://localhost:8000";

export async function analyzeUrl(url) {
  const response = await fetch(`${API_BASE_URL}/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(
      `URL 분석 요청 실패: ${response.status}`
    );
  }

  return response.json();
}

