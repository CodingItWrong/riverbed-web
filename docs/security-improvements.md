# Security Improvement Recommendations

Audit of the Riverbed Web codebase against the project's security rules (`rules/`).

## High Priority

### 2. No Content-Security-Policy headers (csp-headers)

**File:** `web/index.html`, deployment config

There is no CSP `<meta>` tag in `web/index.html` and no server-side CSP headers configured. The app is deployed to GitHub Pages, which does not support custom response headers natively.

**Rule:** _csp-headers.mdc_ — "Prefer a strict CSP; avoid `unsafe-inline` and `unsafe-eval`."

**Recommendation:**

- Add a `<meta http-equiv="Content-Security-Policy">` tag to `web/index.html` with a policy restricting `script-src`, `style-src`, and `connect-src` to the app's own origin and required third-party domains (e.g., Google Maps API).
- Note: the inline `<style>` block and the SPA routing `<script>` in `index.html` would need nonces or hashes, or be moved to external files.

### 3. No clickjacking protection (csp-headers)

**Rule:** _csp-headers.mdc_ — "Set X-Frame-Options: DENY or use CSP frame-ancestors 'none'."

**Recommendation:** Add `frame-ancestors 'none'` to the CSP meta tag (see above). GitHub Pages doesn't set `X-Frame-Options`, so the CSP approach is the only option without a proxy.

## Medium Priority

### 5. URL validation allows javascript: scheme (xss, react)

**File:** `src/utils/urlUtils.js`

The `isValidUrl` regex (`/^\w+:\/\/([^/]+\.\w+)/`) matches any scheme including `javascript://`. While `javascript:` URLs typically don't contain `//`, a crafted URL like `javascript://example.com/%0aalert(1)` could pass validation and be rendered in `AutoDetectLink` as a clickable `<a href>`.

**Rule:** _xss.mdc_ — "Validate and sanitize URLs before `<a href>`. Allowlist `https://`; reject `javascript:`."
_react.mdc_ — "Avoid `href={userUrl}` without validation; allowlist `https://` and reject `javascript:`."

**Recommendation:** Change `isValidUrl` to allowlist only `http://` and `https://` schemes:

```js
export function isValidUrl(string) {
  return /^https?:\/\/([^/]+\.\w+)/.test(string);
}
```

### 6. Google Maps link uses HTTP instead of HTTPS (general-security, api-network)

**File:** `src/components/fieldTypes/geolocation.js:52`

```js
window.open(`http://maps.${company}.com/maps?daddr=${daddr}`);
```

**Rule:** _general-security.mdc_ — "HTTPS only."
_api-network.mdc_ — "Call APIs over HTTPS only."

**Recommendation:** Change `http://` to `https://`.

### 7. No dependency audit in CI (dependencies)

**Files:** `.github/workflows/test.yml`, `.github/workflows/deploy.yml`

Neither CI workflow runs `pnpm audit` or uses Dependabot/Snyk for vulnerability scanning.

**Rule:** _dependencies.mdc_ — "Run npm audit (or equivalent) in CI; fix high/critical or document accepted risk."

**Recommendation:** Add a `pnpm audit --audit-level=high` step to the test workflow, and/or enable Dependabot security alerts on the GitHub repository.

## Low Priority

### 9. Missing rel="noopener noreferrer" on some target="\_blank" links

**File:** `src/components/AutoDetectLink.js:11`

The `<Link>` component opens user-provided URLs in a new tab with `target="_blank"` but no explicit `rel="noopener noreferrer"`. While modern browsers default to `noopener`, explicitly setting it is a defense-in-depth measure. The SignIn page links correctly use `rel="noreferrer"`.

**Recommendation:** Add `rel="noopener noreferrer"` to the `AutoDetectLink` component.

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

| #   | Issue                             | Rule(s)                          | Priority        |
| --- | --------------------------------- | -------------------------------- | --------------- |
| 1   | Token in localStorage             | auth-sessions, sensitive-data    | High            |
| 2   | No CSP headers                    | csp-headers                      | High            |
| 3   | No clickjacking protection        | csp-headers                      | High            |
| 4   | console.error in production       | sensitive-data, general-security | Medium          |
| 5   | URL validation allows javascript: | xss, react                       | Medium          |
| 6   | Maps link uses HTTP               | general-security, api-network    | Medium          |
| 7   | No dependency audit in CI         | dependencies                     | Medium          |
| 8   | Server error text passed to UI    | general-security                 | Medium          |
| 9   | Missing rel on target=\_blank     | xss (defense-in-depth)           | Low             |
| 10  | Maps API key in bundle            | sensitive-data                   | Low             |
| 11  | Dev base URL uses HTTP            | api-network                      | Low (no action) |
