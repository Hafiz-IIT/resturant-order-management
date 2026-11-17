# Admin API Security Review

## Current prototype controls

- Admin passwords are stored as salted scrypt hashes; password derivation and verification use the asynchronous Node crypto API.
- Admin bearer tokens are signed with HS256, require a configured secret of at least 32 bytes, and expire after one hour.
- Initial admin creation requires a separate one-time bootstrap secret and a unique bootstrap lock.
- Admin creation/listing and sensitive order/menu/feedback routes require an authenticated admin.
- Admin login is limited to five attempts per client IP per 15-minute window.
- Initial admin bootstrap is limited to three attempts per client IP per hour.
- Rate-limit state is process-local and bounded in memory.

## Important deployment limitations

The rate limiter is only a single-process prototype guard. It does not coordinate across multiple server instances, containers or restarts. Production deployment requires a shared store (for example Redis), correct reverse-proxy trust configuration, monitoring and an account-level abuse policy.

The current CI checks JavaScript syntax and security utility tests. It does not install the application dependencies, boot Express against MongoDB, or run authenticated HTTP integration tests. A committed lockfile and deterministic dependency installation are still required.

Before handling real customer/admin data, add:
1. a committed npm lockfile and deterministic `npm ci` workflow;
2. MongoDB-backed integration tests for bootstrap, login, authorization and protected endpoints;
3. shared-store rate limiting and account-level abuse/lockout controls;
4. security logging and secret rotation/revocation procedures;
5. deployment review of CORS, proxy settings, database access and backups.

This repository remains a development prototype, not a production-hardened ordering service.
