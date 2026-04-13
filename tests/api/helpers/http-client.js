// lightweight HTTP client using Node's built-in https module (no dependencies)

const https = require('https');
const DEFAULT_BASE_URL = 'https://jsonplaceholder.typicode.com';

function request(method, path, { baseUrl = DEFAULT_BASE_URL, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk)); // collect response chunks
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body)); // send request body for POST/PUT
    req.end();
  });
}

module.exports = {
  get:    (path, opts) => request('GET', path, opts),
  post:   (path, opts) => request('POST', path, opts),
  put:    (path, opts) => request('PUT', path, opts),
  delete: (path, opts) => request('DELETE', path, opts),
};
