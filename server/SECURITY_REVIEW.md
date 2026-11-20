# Security review and deployment requirements

## Implemented controls in this branch
- Admin passwords are stored using salted scrypt hashes.
- Initial admin bootstrap requires a dedicated high-entropy secret and can run only once.
- Subsequent admin creation and order/menu administration require a signed, expiring bearer token.
- Administrative endpoints are protected; public order submission and public menu reads are separated from administrative operations.
- Order status changes follow a forward-only state transition graph.
- Request payloads are bounded and rate-limited.

## Existing-data migration
The schema update does not erase legacy plaintext password fields already stored in MongoDB. Before deployment:
1. Back up the database securely.
2. Force password resets for all existing admin accounts.
3. Remove legacy plaintext password fields from every admin document.
4. Verify that only passwordHash remains and that the login flow succeeds.
5. Rotate JWT_SECRET and ADMIN_BOOTSTRAP_SECRET after bootstrap if operationally appropriate.

## Remaining production requirements
- Generate and commit a package-lock.json, then use npm ci in CI/deployment.
- Add MongoDB integration tests for admin bootstrap, login, authorization, order creation and state transitions.
- Use a distributed rate limiter if running multiple server instances.
- Add abuse controls and server-side menu/price validation before processing real payments.
- Configure HTTPS, secure cookie/token storage, secret rotation, monitoring and backup/restore.
- Conduct an independent security review before handling real customer or payment data.

This branch is not a production certification.
