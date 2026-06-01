# Frontend Wiring

PawIt frontend repos must treat `openapi/pawit.v1.yaml` as the source of truth for backend communication.

## Runtime Configuration

Each frontend app should expose one API base URL setting:

- Hospital portal: `NEXT_PUBLIC_PAWIT_API_BASE_URL`
- Pet-parent portal: `VITE_PAWIT_API_BASE_URL`
- Booking BFF: `PAWIT_API_BASE_URL`

Local default:

```text
http://localhost:8080
```

Production default is the Cloud Run or global HTTPS load balancer API origin.

## Authentication

Production frontends use the backend-managed `pawit_access` HttpOnly cookie or a bearer token where appropriate.

Local development may use the backend dev-auth headers only when `PAWIT_ALLOW_DEV_AUTH=true`:

```text
X-PawIt-Tenant-ID: <tenant uuid>
X-PawIt-User-ID: <user uuid>
X-PawIt-Role: ClinicAdmin | Veterinarian | Receptionist | VetTechnician | LabTechnician | PetParent
```

## Client Generation

Generate TypeScript API types from the OpenAPI contract:

```sh
npm run generate
```

The generated file is:

```text
src/pawit-api.ts
```

Frontend API wrappers should use these generated path and schema types for request bodies and responses. Do not duplicate backend shapes by hand inside frontend repos.

## Mutation Rules

All mutation calls should send an `Idempotency-Key` header so retries are safe:

- `POST /api/v1/appointments`
- `POST /api/v1/appointments/{id}/cancel`
- `POST /api/v1/queue/walk-ins`
- `POST /api/v1/queue/{id}/call`
- `POST /api/v1/queue/{id}/start`
- `POST /api/v1/queue/{id}/complete`
- `POST /api/v1/queue/{id}/cancel`
- `POST /api/v1/pets`
- `POST /api/v1/pets/{id}/archive`
- `POST /api/v1/pets/{id}/documents`
- `POST /api/v1/lab-tests`
- `POST /api/v1/lab-tests/{id}/status`
- `POST /api/v1/lab-tests/{id}/report`
- `POST /api/v1/billing/invoices`
- `POST /api/v1/billing/invoices/{id}/void`

## Naming

Use veterinary naming in new UI code:

- Use `pets` instead of `patients`.
- Keep `/api/v1/patients` only as a temporary compatibility alias.
- Use `veterinarian` instead of `doctor` in new UI copy where possible.

## Contract Change Flow

1. Update `openapi/pawit.v1.yaml`.
2. Run lint and type generation.
3. Update backend implementation and tests.
4. Update frontend API wrappers and screens.
5. Keep README instructions in each repo aligned with the contract.
