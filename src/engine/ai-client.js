/** Client for the server-side AI proxy. */
export async function generateWithServerAI(prompt, generationConfig, timeoutMs = 12000) {
  if (!navigator.onLine) return null;
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, generationConfig }), signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.text?.trim() || null;
  } catch { return null; }
}
