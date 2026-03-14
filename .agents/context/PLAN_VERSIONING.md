# PLAN VERSIONING GUIDELINES

This document defines the **versioning conventions for architecture plans, design documents, and backend guidelines** used across the platform.

These rules apply to documents such as:

* Event architecture
* Backend conventions
* Microservice design plans
* Feature plans
* System architecture documentation

The goal is to ensure plans evolve in a **traceable, structured, and non-breaking way**.

---

# 1. Versioning Model

All plans must follow **Semantic Versioning**:

```
MAJOR.MINOR.PATCH
```

Example:

```
v1.0.0
```

---

## MAJOR Version

A **MAJOR** version change represents a **breaking architectural change**.

Example:

```
v1.0.0 → v2.0.0
```

Use MAJOR when:

* Event naming conventions change
* Event schemas change
* Microservice responsibilities change
* Pipeline architecture changes
* Core design principles change

MAJOR versions signal that previous implementations may need updates.

---

## MINOR Version

A **MINOR** version change introduces **new content without breaking existing conventions**.

Example:

```
v1.1.0
```

Use MINOR when:

* New microservices are added
* New events are introduced
* New conventions are added
* Documentation expands with new sections

---

## PATCH Version

A **PATCH** version change includes **non-breaking improvements or corrections**.

Example:

```
v1.1.1
```

Use PATCH when:

* Fixing typos
* Improving explanations
* Clarifying examples
* Minor formatting updates

PATCH changes must not affect the meaning of the architecture.

---

# 2. Document Metadata Header

Every architecture plan must start with a **metadata header**.

Template:

```
# Document Title

Version: v1.0.0
Status: DRAFT
Owner: Platform Engineering
Last Updated: YYYY-MM-DD
```

Example:

```
# Event Architecture

Version: v1.0.0
Status: ACTIVE
Owner: Platform Engineering
Last Updated: 2026-03-14
```

---

# 3. Document Status Lifecycle

Plans progress through a lifecycle as they evolve.

Allowed statuses:

```
DRAFT
PROPOSED
ACTIVE
DEPRECATED
ARCHIVED
```

### DRAFT

The document is being actively written.

It may contain incomplete sections.

---

### PROPOSED

The architecture is proposed but not yet fully adopted.

Used during review or early development phases.

---

### ACTIVE

The document defines the **current production architecture**.

All new services and features must follow this document.

---

### DEPRECATED

The architecture is no longer recommended.

A replacement document must be referenced.

Example:

```
Status: DEPRECATED
Replaced by: event-architecture v2
```

---

### ARCHIVED

The document is preserved for historical reference.

It is no longer maintained.

---

# 4. Changelog Requirement

Every plan must maintain a **changelog section**.

Template:

```
## Changelog

### v1.0.0 — YYYY-MM-DD
Initial release.

### v1.1.0 — YYYY-MM-DD
Added new pipeline events.

### v1.1.1 — YYYY-MM-DD
Improved examples and corrected typos.
```

The changelog allows developers to understand **how the architecture evolved**.

---

# 5. File Naming Convention

Plan files should **not include versions in the filename**.

Correct:

```
event-architecture.md
backend-guidelines.md
ingestion-pipeline.md
```

Avoid:

```
event-architecture-v1.md
event-architecture-v2.md
```

The version must always be stored **inside the document header**.

This prevents repository clutter and confusion.

---

# 6. Versioning Scope

Plan versions are **independent from system versions**.

| Component          | Version Type            |
| ------------------ | ----------------------- |
| Architecture Plans | Semantic Versioning     |
| Event Schemas      | Schema Version          |
| APIs               | API Version             |
| Microservices      | Container/Image Version |

Example event schema:

```
{
  "event": "track.transcoding.completed",
  "version": 1
}
```

This version refers to the **event schema**, not the architecture plan.

---

# 7. Architecture Decision Records (Optional)

Plans may include **Architecture Decision Records (ADR)**.

These document important design decisions.

Example:

```
## Architecture Decisions

ADR-001 — Use event-driven architecture
ADR-002 — Use NATS as the event broker
ADR-003 — Standardize event envelope format
```

ADR entries help future developers understand **why architectural choices were made**.

---

# 8. Recommended Documentation Structure

```
docs/
  backend/
    PLANVERSIONING.md
    event-architecture.md
    backend-guidelines.md
    ingestion-pipeline.md
```

All documents in this directory must follow these versioning guidelines.

---

# 9. Template for New Plans

Use this template when creating a new architecture plan.

```
# Plan Title

Version: v1.0.0
Status: DRAFT
Owner: Platform Engineering
Last Updated: YYYY-MM-DD

---

## Overview

Brief description of the architecture or feature.

## Goals

Define the goals of this architecture.

## Architecture

Describe system components and interactions.

## Conventions

List rules and standards introduced by the plan.

## Architecture Decisions

(Optional)

## Changelog

### v1.0.0 — YYYY-MM-DD
Initial draft.
```

---

# 10. Guiding Principle

Plans should evolve **incrementally and transparently**.

Versioning ensures that architectural changes remain:

* traceable
* auditable
* understandable
* stable across teams and services
