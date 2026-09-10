/** Server-side Cloudflare Workers AI proxy. Keep all credentials off the client. */
const MAX_PROMPT_LENGTH = 16000;

function sendJson(response, status, body) { response.status(status).json(body); }

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const model = process.env.CLOUDFLARE_AI_MODEL;
  if (!accountId || !apiToken || !model) return sendJson(response, 503, { error: 'AI service is not configured.' });

  const { prompt, generationConfig = {} } = request.body || {};
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > MAX_PROMPT_LENGTH) {
    return sendJson(response, 400, { error: `prompt must be a non-empty string up to ${MAX_PROMPT_LENGTH} characters.` });
  }

  try {
    const aiResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${encodeURIComponent(model)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        ...(Number.isFinite(Number(generationConfig.maxOutputTokens)) ? { max_tokens: Math.max(1, Math.min(2048, Math.floor(Number(generationConfig.maxOutputTokens)))) } : {}),
        ...(Number.isFinite(Number(generationConfig.temperature)) ? { temperature: Math.max(0, Math.min(2, Number(generationConfig.temperature))) } : {})
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (!aiResponse.ok) {
      console.error('Cloudflare AI request failed:', aiResponse.status);
      return sendJson(response, 502, { error: 'AI service request failed.' });
    }
    const data = await aiResponse.json();
    const text = data?.result?.response?.trim() || data?.result?.message?.content?.trim();
    if (!data?.success || !text) return sendJson(response, 502, { error: 'AI service returned no text.' });
    return sendJson(response, 200, { text, model });
  } catch (error) {
    console.error('Cloudflare AI proxy error:', error);
    return sendJson(response, 502, { error: 'AI service is temporarily unavailable.' });
  }
}
