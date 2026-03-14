# Service Renaming Plan

## Microservice Naming Migration

### Purpose

This document records the renaming of several microservices and AI modules across the platform.

The goal is to:

- improve naming consistency
- separate AI modules more clearly
- prepare the architecture for future refactoring

This file acts as a reference for developers and LLM prompts so both old and new names can be understood during the transition.

### Current Architecture Groups

The system currently organizes services into the following domains:

- `ai/`
- `ingestion/`
- `realtime/`
- `streaming/`

Some services were renamed to better represent their responsibilities.

---

## Service Renaming Map

### AI Services

The previous AI service structure grouped multiple modules inside a single service.

**Old structure:**

```
ai/
  sempiternal
```

**New structure:**

```
ai/
  shinod-ai
```

`shinod-ai` currently still contains multiple internal modules, but these may be split into independent microservices in the future.

### AI Module Renames

Several modules inside the AI service were renamed.

#### Transcription Module (fort-minor)

- **Old:** `ai/shinod-ai/transcription`
- **New:** `ai/fort-minor`
- **Responsibility:** audio transcription, lyrics extraction, speech-to-text processing

#### Fingerprint Module (petrified)

- **Old:** `ai/shinod-ai/fingerprint`
- **New:** `ai/petrified`
- **Responsibility:** acoustic fingerprint generation, track identity detection, audio signature matching

#### Stereo Module

- **Old:** `ai/shinod-ai/reasoning`
- **New:** `ai/stereo`
- **Responsibility:** AI reasoning over audio analysis results, classification and approval decisions, metadata enrichment

---

### Ingestion Services

#### Soundgarden

- **Location:** `ingestion/soundgarden`
- **Status:** UNCHANGED
- **Responsibility:** accept user audio uploads, validate files, emit ingestion events

---

### Realtime Services

#### Backstage

- **Location:** `realtime/backstage`
- **Status:** UNCHANGED
- **Responsibility:** subscribe to platform events, track pipeline lifecycle, expose monitoring APIs

---

### Streaming Services

#### Mockingbird

- **Location:** `streaming/mockingbird`
- **Status:** UNCHANGED
- **Responsibility:** audio transcoding, format conversion, streaming preparation

#### Storage Service

- **Old:** `streaming/fort-minor`
- **New:** `streaming/storage`
- **Responsibility:** long-term storage of processed audio, delivery-ready media assets, integration with object storage
