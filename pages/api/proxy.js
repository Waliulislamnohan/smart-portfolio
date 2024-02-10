// api/proxy.js
export default async function handler(req, res) {
  const { method, headers, body } = req;

  try {
    const response = await fetch('https://retune.so' + req.url, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
