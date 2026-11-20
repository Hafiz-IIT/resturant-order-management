# Security and deployment notes

- Configure ADMIN_API_TOKEN with at least 32 random characters and CLIENT_ORIGINS with the exact browser origins.
- Admin provisioning, order-list reads, order-status changes and menu writes require the bearer token. This shared-token gate is not a full user/session authentication system.
- Existing MongoDB Admin documents may still contain the old plaintext password field. Before deployment, rotate those credentials and remove the legacy password field from every existing document; changing the Mongoose schema does not migrate or erase stored data.
- Order status changes follow a forward-only transition graph. Terminal states served and cancelled cannot be reopened through this endpoint.
- Public order creation remains unauthenticated for customer checkout. Add rate limiting, abuse monitoring, and server-side menu-item/price validation before accepting real payments or production traffic.
- The repository still needs a pinned Node dependency manifest, lockfile, MongoDB integration tests, and an authenticated admin login/session flow before production deployment.
