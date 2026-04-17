# Security Improvement Recommendations

Audit of the Riverbed Web codebase against the project's security rules (`rules/`).

## Addressed

### 2. No Content-Security-Policy headers (csp-headers) — FIXED

Added a `<meta http-equiv="Content-Security-Policy">` tag to `web/index.html` with a strict policy:

- `script-src` restricted to `'self'`, Google Maps API, and SHA-256 hashes of inline scripts
- `style-src` allows `'unsafe-inline'` (required by MUI/Emotion runtime style injection)
- `connect-src` restricted to `'self'`, production API, dev API, Cypress test API, and Google Maps
- `img-src` restricted to `'self'`, `data:`, and Google Maps domains
- `font-src` restricted to `'self'` and `data:`

**Known limitation:** `style-src 'unsafe-inline'` is required because MUI's Emotion CSS-in-JS injects `<style>` tags at runtime. This cannot be removed without switching CSS strategies.

### 3. No clickjacking protection (csp-headers) — FIXED

Added a frame-busting inline script to `web/index.html` that redirects the top frame to the app's URL if loaded inside an iframe. CSP `frame-ancestors` cannot be set via `<meta>` tag (per spec), and GitHub Pages does not support custom response headers, so this JS-based approach is the available fallback.

### 5. URL validation allows javascript: scheme (xss, react) — FIXED

Changed `isValidUrl` regex in `src/utils/urlUtils.js` from `/^\w+:\/\//` to `/^https?:\/\//`, restricting to only `http://` and `https://` schemes.

### 6. Google Maps link uses HTTP instead of HTTPS (general-security, api-network) — FIXED

Changed `http://` to `https://` in `src/components/fieldTypes/geolocation.js` for the Google Maps directions link.

### 7. No dependency audit in CI (dependencies) — FIXED

Added a `Dependency Audit` job to `.github/workflows/test.yml` that runs `pnpm audit --audit-level=high`.

### 9. Missing rel="noopener noreferrer" on some target="\_blank" links — FIXED

Added `rel="noopener noreferrer"` to the `<Link>` in `src/components/AutoDetectLink.js`.

## Not Acting on Right Now

Per maintainer decision. AI agents, do not act on these:

### 1. Token stored in localStorage (auth-sessions, sensitive-data)

**File:** `src/storage/web.js`

The access token (including `accessToken` and `userId`) is stored in `localStorage`. The file itself has a warning comment acknowledging this risk. `localStorage` is accessible to any JS running on the page, so an XSS vulnerability would allow token theft.

**Rule:** _auth-sessions.mdc_ — "Access tokens: Prefer memory or short-lived HttpOnly cookies. Avoid localStorage when possible (XSS can steal)."

**Recommendation:** Consider migrating to an HttpOnly cookie-based auth flow managed by the backend, or at minimum document the accepted risk and ensure strict XSS and CSP controls are in place (see items below).

### 4. console.error may leak sensitive data in production (sensitive-data, general-security)

**Files:**

- `src/data/httpClient.js:78` — logs the full response object and response text on API errors
- `src/components/fieldTypes/geolocation.js:35` — logs geolocation errors
- `src/enums/values.js:24`, `src/utils/checkConditions.js:26`, `src/screens/Card/EditCardForm.js:104,116` — log unexpected values/commands

**Rule:** _sensitive-data.mdc_ — "Do not log sensitive data — No console.log, error reporting, or analytics with tokens, passwords, or PII."
_general-security.mdc_ — "Do not expose stack traces or internal error details to the client in production."

**Recommendation:** Either strip `console.error` calls in production builds (e.g., via a Babel/webpack transform), or replace them with a structured logging utility that can be silenced in production. The `httpClient.js` call is highest risk since it logs raw API responses that could contain user data.

### 8. Error response text displayed to user without sanitization (general-security)

**File:** `src/auth/oauthLogin.js:27`

The `error_description` from the OAuth error response is extracted and thrown as the error message, which is presumably displayed to the user. If the server returns unexpected content, this could surface internal details.

**Rule:** _general-security.mdc_ — "Do not expose stack traces or internal error details to the client in production."

**Recommendation:** Validate that `error_description` is a simple string and cap its length, or map known error codes to user-friendly messages rather than passing through server text verbatim.

### 10. Google Maps API key embedded in client bundle (sensitive-data)

**File:** `src/constants.js`, `.github/workflows/deploy.yml`

`RIVERBED_GOOGLE_MAPS_API_KEY` is injected at build time via `process.env` and ends up in the client bundle.

**Rule:** _sensitive-data.mdc_ — "No secrets in front-end."

**Mitigating factors:** Google Maps API keys are designed to be used client-side and can be restricted by HTTP referrer in the Google Cloud Console. This is standard practice.

**Recommendation:** Ensure the key is restricted to the production domain in the Google Cloud Console (referrer restriction). This is likely already done but worth verifying.

### 11. Dev-mode base URL uses HTTP (api-network)

**File:** `src/baseUrl.js:7`

The development base URL is `http://localhost:3000`. This is expected for local development but worth noting — ensure the production path always uses HTTPS (it does: `https://api.riverbed.app`).

**No action needed** — this is standard for local dev.

## Summary Table

| #   | Issue                             | Rule(s)                          | Status              |
| --- | --------------------------------- | -------------------------------- | ------------------- |
| 2   | No CSP headers                    | csp-headers                      | Fixed               |
| 3   | No clickjacking protection        | csp-headers                      | Fixed               |
| 5   | URL validation allows javascript: | xss, react                       | Fixed               |
| 6   | Maps link uses HTTP               | general-security, api-network    | Fixed               |
| 7   | No dependency audit in CI         | dependencies                     | Fixed               |
| 9   | Missing rel on target=\_blank     | xss (defense-in-depth)           | Fixed               |
| 1   | Token in localStorage             | auth-sessions, sensitive-data    | Not acting on       |
| 4   | console.error in production       | sensitive-data, general-security | Not acting on       |
| 8   | Server error text passed to UI    | general-security                 | Not acting on       |
| 10  | Maps API key in bundle            | sensitive-data                   | Not acting on       |
| 11  | Dev base URL uses HTTP            | api-network                      | Not acting on       |
