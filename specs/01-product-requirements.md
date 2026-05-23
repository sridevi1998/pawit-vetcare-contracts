# PawIt VetCare Product Requirements

## 1. Product Overview

PawIt VetCare is a multi-tenant SaaS veterinary hospital management platform for veterinary clinics, clinic groups, and veterinary hospital companies.

The short product name is **PawIt**. The full product name is **PawIt VetCare**.

PawIt helps veterinary teams manage appointments, walk-ins, pet records, clinical notes, prescription records, lab orders, billing, staff, veterinarians, analytics, and pet-parent self-service.

The clinic portal should closely follow the Docran-style operational UI: left sidebar navigation, top page header, stat cards, filters, tables, empty states, and focused workflow screens. PawIt adapts that experience to veterinary care.

## 2. Product Goals

- Support multi-tenant SaaS from day one.
- Allow each tenant to manage one or more clinic locations.
- Provide a secure clinic operations portal for staff.
- Provide a thin pet-parent portal for self-service access.
- Support dogs and cats in v1.
- Support in-clinic, telemedicine, walk-in, follow-up, vaccination, lab/diagnostic, and procedure/surgery consult appointments.
- Support walk-in queue management in v1.
- Support record-only prescriptions in v1.
- Support internal clinic labs and manual external lab center workflows in v1.
- Support US payments through Stripe, including Apple Pay readiness.
- Follow HIPAA-aligned security and audit practices from day one.

## 3. Non-Goals For V1

The following are intentionally out of scope for v1:

- AI advisory or AI clinical decision support.
- Built-in video meeting rooms.
- Automated third-party lab API integrations.
- Printable/shareable prescription PDFs.
- Native mobile app store releases.
- Complex inventory/pharmacy stock management.
- Automated insurance claims.
- Multi-species support beyond dogs and cats.
- Grooming and other non-medical service workflows.
- State-specific tax calculation or automated tax filing.

## 4. Tenant And Location Model

A tenant represents a veterinary business, clinic group, or company.

Each tenant can have multiple clinic locations.

All operational records must belong to a tenant. Location-specific records should also reference a clinic location where applicable.

Examples of tenant-scoped records:

- appointments
- appointment requests
- queue entries
- staff schedules
- invoices
- lab orders
- visits
- clinical notes
- prescriptions
- uploaded documents
- audit logs

Tenant isolation is mandatory. Users must never access data outside their assigned tenant unless they are PawIt `SuperAdmin` users operating through an audited support or impersonation flow.

## 5. User Roles

PawIt v1 supports these roles:

- `SuperAdmin`
- `ClinicAdmin`
- `Veterinarian`
- `Receptionist`
- `VetTechnician`
- `LabTechnician`
- `PetParent`

### SuperAdmin

Internal PawIt platform administrator.

Can manage:

- all tenants
- tenant status
- platform-level settings
- platform audit review
- support and impersonation workflows

`SuperAdmin` users cannot freely browse tenant clinical data. Tenant clinical access requires an audited support/impersonation flow.

### ClinicAdmin

Tenant-level administrator.

Can manage:

- clinic profile
- clinic locations
- staff and veterinarian users
- tenant billing/payment settings
- all operational records inside their tenant
- role assignments inside tenant
- tenant exports

`ClinicAdmin` clinical-note access is normal tenant access and does not require a separate support reason prompt, but sensitive record access must still be audited.

### Veterinarian

Clinical care provider.

Can manage:

- assigned appointments
- pet records
- clinical notes
- prescriptions
- lab orders
- diagnoses and treatment records

### Receptionist

Front desk and operational staff.

Can manage:

- appointments
- appointment requests
- check-in
- walk-ins
- queue
- pet parent contact info
- document uploads
- front-desk billing workflows

Receptionists may view clinical notes as part of the clinic workflow, but access must be audited.

### VetTechnician

Clinical support staff.

Can manage:

- vitals
- visit preparation
- sample collection
- lab workflow support
- draft clinical notes
- prescription drafts
- treatment task support

Veterinarian review/finalization is required for clinical notes and prescriptions.

### LabTechnician

Lab workflow user.

Can manage:

- lab order status
- sample status
- test result upload
- result completion

Lab technicians see lab operational data, not full invoice or payment details.

### PetParent

External customer user.

Can:

- log in with email/password
- view their pets
- edit pet details
- request appointments
- cancel appointments according to clinic cancellation policy
- upload pet documents
- view shared clinical notes
- view shared lab results
- view shared prescription records
- view invoices and payment links
- manage their own profile

## 6. Pet And Guardian Model

PawIt v1 supports dogs and cats.

A pet can have multiple guardians.

A pet parent can own or manage multiple pets.

Pet record fields should include:

- pet name
- species: dog or cat
- breed
- sex
- date of birth or estimated age
- weight history
- microchip ID
- allergies
- active conditions
- vaccination history
- deworming history
- owner/guardian relationships
- clinical history
- lab history
- invoice history
- uploaded documents

Pet parents can directly edit pet details in v1. Sensitive edits should be audited and visible to clinic staff.

## 7. Appointment Requirements

PawIt v1 supports these appointment types:

- in-clinic visit
- telemedicine visit
- walk-in
- follow-up
- vaccination
- lab/diagnostic visit
- procedure/surgery consult

Grooming and non-medical service appointments are out of scope for v1.

Appointments should support:

- one primary veterinarian
- zero or more additional veterinarians
- pet
- pet parent
- clinic location
- appointment type
- status
- reason for visit
- notes
- telemedicine meeting URL, when applicable

Appointment status should include:

- requested
- scheduled
- confirmed
- checked-in
- waiting
- in-progress
- completed
- cancelled
- no-show
- needs-reschedule
- rejected

Pet parents can request appointments from the pet-parent portal.

Clinic staff can:

- approve requests
- assign veterinarian(s)
- assign clinic location
- schedule date/time
- reschedule
- reject requests
- cancel appointments

Telemedicine appointments in v1 use manual meeting links.

V1 telemedicine supports:

- meeting URL
- meeting instructions
- email notification containing the link
- pet-parent portal display of the link

V1 does not generate video rooms.

## 8. Cancellation Policy

Clinics can configure appointment cancellation policy.

Recommended default:

- pet parents cannot directly cancel within 24 hours of appointment start
- pet parents can request cancellation/contact clinic inside the cutoff window
- clinic staff can override cancellation when needed

The cancellation cutoff should be tenant-level by default with optional location-level override.

## 9. Queue Requirements

Walk-in queue management is included in v1.

Queue entries should support:

- pet
- pet parent
- optional appointment link
- walk-in flag
- priority
- reason for visit
- assigned veterinarian, optional
- status
- check-in time
- wait time
- call-next action
- remove/cancel action

Queue status should include:

- waiting
- called
- in-progress
- completed
- cancelled

## 10. Clinical Notes Requirements

Clinical notes should support veterinary visit documentation.

V1 should support:

- reason for visit
- subjective notes
- objective notes
- assessment
- plan
- vitals
- diagnosis text
- draft status
- veterinarian finalization
- veterinarian signature/status
- shared-with-pet-parent flag
- audit history

Vet technicians can create draft clinical notes for veterinarians to finalize.

Pet parents can view clinical notes only when shared by the clinic.

## 11. Prescription Requirements

Prescriptions are record-only in v1.

V1 should support:

- medication name
- strength
- dosage
- frequency
- duration
- route
- instructions
- prescribing veterinarian
- linked visit
- linked pet
- draft/final status
- shared-with-pet-parent flag

Vet technicians can view prescriptions and create prescription drafts. Veterinarians must finalize prescriptions.

V1 does not require printable/shareable prescription PDFs.

## 12. Lab Requirements

PawIt v1 supports both internal clinic labs and external lab centers in the data model.

External lab center integration is manual/status-based in v1.

Lab orders should support:

- pet
- pet parent
- ordering veterinarian
- clinic location
- lab type: internal or external
- external lab center name, when applicable
- test type
- sample type
- priority
- status
- result upload
- result notes
- share-with-pet-parent flag
- linked invoice line item

Lab status should include:

- ordered
- sample-collected
- sent-out
- in-progress
- completed
- cancelled

No third-party lab API integrations are required in v1.

## 13. Billing And Payments Requirements

PawIt v1 is United States-first for payment context.

Stripe is the default payment provider.

Stripe should support:

- cards
- Apple Pay readiness
- payment links or checkout sessions
- invoice payment status
- webhook-based payment confirmation

Invoice tax fields should be generic in v1.

V1 does not require:

- state-specific sales tax calculation
- automated tax filing
- tax jurisdiction rules
- Stripe Tax integration

Invoices should support:

- pet
- pet parent
- clinic location
- line items
- subtotal
- tax amount
- discount amount
- total amount
- currency: USD
- payment status
- Stripe payment reference
- due date
- paid date

Billing status should include:

- draft
- issued
- pending
- paid
- void
- refunded

## 14. Pet Parent Portal V1

Pet-parent portal is thin in v1.

V1 supports:

- email/password login
- view pets
- edit pet details
- request appointments
- cancel appointments according to clinic policy
- view requested appointment status
- view upcoming appointments
- view telemedicine meeting links
- upload pet documents
- view shared clinical notes
- view shared lab results
- view shared prescription records
- view invoices
- open Stripe payment links
- update own profile basics

Pet document uploads should support:

- vaccine records
- prior prescriptions
- lab reports
- adoption records
- discharge summaries
- other medical documents

## 15. Clinic Portal V1

Clinic portal is the main v1 implementation focus.

It should include:

- login
- appointments
- appointment requests
- calendar
- queue
- pet records
- pet profile
- clinical notes
- prescription records
- lab orders/results
- billing/invoices
- feedback
- analytics
- staff management
- veterinarian management
- clinic settings
- tenant/location switching, if user has access to multiple locations

The UI should closely follow the Docran screenshots while using PawIt veterinary terminology.

## 16. Notifications

V1 should prepare for:

- appointment request emails
- appointment confirmation emails
- appointment reminder emails
- telemedicine link emails
- invoice/payment emails
- lab result available emails
- password reset emails

SMS and push notifications can be later unless required for launch.

## 17. Security And Compliance

PawIt should be HIPAA-aligned from day one.

Required security principles:

- tenant isolation
- role-based access control
- least-privilege permissions
- secure password hashing
- JWT via HttpOnly Secure SameSite cookies
- refresh token rotation
- audit logging for sensitive actions
- encryption for sensitive fields
- encrypted transport
- private database networking in production
- secrets stored outside source code
- production logging without sensitive data exposure
- rate limiting
- strict CORS allow-listing
- secure headers
- archive/cancel/void instead of hard-delete for clinical and financial records

Audit logs should include:

- user
- tenant
- location, where applicable
- action
- resource type
- resource ID
- timestamp
- IP/user agent, where available
- reason, when support/impersonation access is used

## 18. MVP Acceptance Criteria

MVP is acceptable when:

- A tenant can be created.
- A tenant can have multiple clinic locations.
- Clinic users can log in.
- Pet parents can log in with email/password.
- Role-based access is enforced.
- Clinic staff can create and manage pet parent records.
- A pet parent can have multiple pets.
- A pet can have multiple guardians.
- Pet parents can edit pet details.
- Pet parents can upload pet documents.
- Staff can create appointments of all v1 appointment types.
- Pet parents can request appointments.
- Clinic staff can approve, schedule, reject, cancel, or reschedule appointment requests.
- An appointment can have one primary veterinarian and multiple additional veterinarians.
- Staff can check in appointments and create walk-ins.
- Queue can be managed end to end.
- Vet technicians can create draft clinical notes.
- Veterinarians can finalize clinical notes.
- Veterinarians can record and finalize prescriptions.
- Vet technicians can create prescription drafts.
- Staff can create internal or external lab orders.
- Lab users can update statuses and upload results.
- Staff can create invoices.
- Invoice tax fields are generic and support manual tax amount entry.
- Pet parents can view pets, appointments, shared clinical notes, prescriptions, lab results, and invoices.
- Stripe payment flow is modeled and ready for integration.
- All core records are tenant-scoped.
- Sensitive actions create audit logs.
- Records are archived/cancelled/voided rather than hard-deleted.
- Grooming/non-medical services are not included in v1 workflows.
- The clinic portal visually follows the Docran-style UI.
