# PawIt VetCare Contracts

Shared API contracts for the PawIt backend and frontend apps. Start with OpenAPI, then generate TypeScript clients for Next.js and Vite apps.

## OpenAPI

- Canonical contract: [openapi/pawit.v1.yaml](openapi/pawit.v1.yaml)
- Current version: `0.3.0`
- Covered backend surface: health/readiness, current user, product policy, roles, navigation, dashboard, appointments, queue, pets, pet documents, clinical reads, billing, analytics, feedback, doctors, and staff.

## Frontend Wiring

Frontend repos should call PawIt through generated types from this contract instead of hand-written response shapes.

```sh
npm install
npm run lint
npm run generate
```

Generated types are written to `src/pawit-api.ts`. Hospital, pet-parent, booking BFF, and marketing repos can import those types or consume this package once it is published/linked.

## Specs

- [Product Requirements](specs/01-product-requirements.md)
- [Roles And Permissions](specs/02-roles-permissions.md)
- [Frontend Wiring](specs/03-frontend-wiring.md)
