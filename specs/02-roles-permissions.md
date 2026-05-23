# PawIt VetCare Roles And Permissions

## 1. Purpose

This spec defines the v1 role and permission model for PawIt VetCare.

The system must enforce tenant isolation, least-privilege access, and auditability. Permissions should be implemented as database-backed permissions, not hard-coded only in frontend navigation.

## 2. Roles

PawIt v1 supports:

- `SuperAdmin`
- `ClinicAdmin`
- `Veterinarian`
- `Receptionist`
- `VetTechnician`
- `LabTechnician`
- `PetParent`

## 3. Access Model

Access is evaluated using:

- authenticated user
- tenant
- clinic location
- assigned role
- explicit permissions
- resource ownership or assignment
- support/impersonation context, when applicable

All application data must be tenant-scoped.

Location-scoped records should also enforce location access where applicable.

## 4. SuperAdmin

`SuperAdmin` is an internal PawIt platform role.

Allowed:

- create, view, update, suspend, and reactivate tenants
- manage platform settings
- view platform operational analytics
- view tenant billing/subscription metadata
- initiate audited support/impersonation access
- review platform audit logs

Not allowed by default:

- direct browsing of tenant clinical records
- direct browsing of pet-parent medical data
- direct modification of tenant clinical records outside support flow

Tenant clinical access requires:

- explicit support/impersonation session
- reason logging
- audit log entry
- time-limited access

## 5. ClinicAdmin

`ClinicAdmin` is the tenant administrator.

Allowed:

- manage tenant profile
- manage clinic locations
- manage staff users
- manage veterinarian users
- assign tenant roles
- configure cancellation cutoff policy
- configure payment settings
- view and manage all tenant operational records
- view clinical notes inside the tenant
- export tenant data
- archive/cancel/void records according to workflow rules
- view tenant audit logs

Not allowed:

- access other tenants
- hard-delete clinical, financial, or audit records
- bypass audit logging

Clinical-note access is normal tenant access for `ClinicAdmin`, but sensitive record access must still create audit logs.

## 6. Veterinarian

Allowed:

- view assigned and tenant-accessible appointments
- create and update clinical notes
- finalize clinical notes
- create and finalize prescriptions
- create lab orders
- view lab results
- share clinical notes, lab results, and prescriptions with pet parents
- view pet records
- update pet medical details
- view clinical and appointment analytics

Not allowed by default:

- manage tenant billing settings
- manage staff roles
- hard-delete records
- issue refunds unless explicitly granted by tenant policy

## 7. Receptionist

Allowed:

- create and manage appointments
- manage appointment requests
- check in appointments
- create walk-ins
- manage queue status
- create and update pet parent records
- upload pet documents
- view pet records
- view clinical notes
- create invoices
- add non-clinical and approved billable line items
- collect or record payments
- view invoice/payment status
- view limited operational analytics

Restricted:

- cannot finalize clinical notes
- cannot finalize prescriptions
- cannot void invoices without `ClinicAdmin` approval/permission
- cannot refund payments without `ClinicAdmin` approval/permission
- cannot manage staff roles

Clinical-note access must be audited.

## 8. VetTechnician

Allowed:

- view appointments relevant to clinical workflow
- record vitals
- prepare visit details
- create draft clinical notes
- view prescriptions
- create prescription drafts
- assist with sample collection
- create lab orders when delegated by clinic workflow
- update lab collection details
- view limited clinical workflow analytics

Restricted:

- cannot finalize clinical notes
- cannot finalize prescriptions
- cannot act as prescribing veterinarian
- cannot manage billing settings
- cannot refund or void invoices
- cannot manage staff roles

Veterinarian review/finalization is required for clinical notes and prescriptions.

## 9. LabTechnician

Allowed:

- view lab orders
- update sample status
- update lab order status
- upload lab reports/results
- add result notes
- mark lab work completed
- view lab workflow statistics

Allowed limited billing context:

- see whether a lab order is billable, billed, or not billed when needed for workflow

Restricted:

- cannot view full invoice details
- cannot view payment methods
- cannot view discounts
- cannot view broader financial history
- cannot create clinical lab orders by default
- cannot finalize clinical notes
- cannot create prescriptions

Lab orders are normally created by veterinarians or delegated clinical/front-desk staff. Lab technicians process orders rather than clinically ordering them.

## 10. PetParent

Allowed:

- log in with email/password
- view own profile
- update own profile basics
- view pets they are linked to as guardian/owner
- edit pet details
- upload pet documents
- request appointments
- cancel appointments according to clinic cancellation policy
- view appointment request status
- view upcoming appointments
- view telemedicine meeting links
- view shared clinical notes
- view shared prescriptions
- view shared lab results
- view invoices
- open Stripe payment links

Restricted:

- cannot access clinic staff portal
- cannot view records for pets they are not linked to
- cannot view unshared clinical notes, prescriptions, or lab results
- cannot cancel appointments inside the clinic-configured cutoff window
- cannot edit finalized clinical notes
- cannot edit prescriptions
- cannot edit invoices

## 11. Permission Matrix

| Area | SuperAdmin | ClinicAdmin | Veterinarian | Receptionist | VetTechnician | LabTechnician | PetParent |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tenant management | Full | Own tenant settings | No | No | No | No | No |
| Location management | Support/audit | Full | View | View | View | View | No |
| Staff management | Support/audit | Full | No | No | No | No | No |
| Role assignment | Support/audit | Full inside tenant | No | No | No | No | No |
| Pet parent records | Support/audit | Full | View/update clinical context | Create/update | View | Limited lab context | Own profile only |
| Pet records | Support/audit | Full | Full medical access | View/update basics | View/update clinical drafts | Limited lab context | Own linked pets |
| Pet document upload | Support/audit | Full | Full | Full | Clinical docs | Lab docs | Own linked pets |
| Appointment requests | Platform metadata | Full | View/accept assigned | Full | View | No | Create/cancel own |
| Appointments | Platform metadata | Full | Full assigned/tenant | Full operational | Clinical workflow | No | Own shared |
| Queue | Platform metadata | Full | Full clinical | Full operational | Clinical workflow | No | No |
| Clinical notes | Support/audit only | View/manage tenant | Create/finalize | View | Draft | No | Shared only |
| Prescriptions | Support/audit only | View/manage tenant | Create/finalize | View | View/draft | No | Shared only |
| Lab orders | Support/audit only | Full | Create/manage | Create/manage operational | Create/manage delegated | Process/update | Shared only |
| Lab results | Support/audit only | Full | Full | View | View | Upload/update | Shared only |
| Invoices | Platform billing metadata | Full | View clinical charges | Create/manage front desk | Limited view | Billable flag only | Own invoices |
| Payments | Platform billing metadata | Full | No by default | Collect/record | No | No | Pay own invoices |
| Refunds/voids | Support/audit | Full | No by default | Approval required | No | No | No |
| Feedback | Platform metadata | Full | View | View | No by default | No | Own feedback |
| Analytics | Platform/tenant metadata | Full tenant | Clinical/appointment | Limited ops | Limited clinical workflow | Lab workflow | No |
| Audit logs | Platform | Tenant | Own sensitive actions, if exposed | No by default | No by default | No by default | Own account events, if exposed |
| Data export | Platform metadata | Full tenant | Clinical exports if granted | Operational exports if granted | No by default | Lab exports if granted | Own data export later |

## 12. Deletion And Archival Rules

Clinical, financial, identity, and audit records should not be hard-deleted in normal workflows.

Use workflow states instead:

- archive
- cancel
- void
- refund
- deactivate
- revoke

Hard deletion, if ever implemented, must be restricted to controlled data-retention tooling and never exposed as a normal app action.

## 13. Audit Requirements

Audit logs are required for:

- login/logout events
- failed login attempts
- role changes
- support/impersonation access
- clinical note access and updates
- prescription access and updates
- lab result upload/share actions
- invoice creation/update/void/refund
- payment webhook processing
- document upload/download/share actions
- pet parent record updates
- pet record updates
- exports

Audit entries should include:

- tenant ID
- clinic location ID, if applicable
- actor user ID
- actor role
- action
- resource type
- resource ID
- timestamp
- IP address, where available
- user agent, where available
- reason, when required

## 14. Cancellation Policy Permissions

Clinic cancellation policy is configurable by `ClinicAdmin`.

Recommended default:

- pet parents can cancel until 24 hours before appointment start
- inside cutoff, pet parents can request cancellation/contact clinic
- clinic staff can cancel or override when appropriate

Cancellation policy is tenant-level by default with optional location-level override.

## 15. Implementation Notes

- Backend must enforce permissions; frontend visibility is not sufficient.
- Permission checks must include tenant scope.
- Permission checks should include location scope where applicable.
- Permissions should be represented in the database so tenant-specific role customization can be added later.
- API responses must not leak inaccessible records through counts, search results, exports, or errors.
