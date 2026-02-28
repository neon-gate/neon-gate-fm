import 'server-only'

import axios from 'axios'

import { LogLevel } from '@infra/observability/log-level.enum'

type LogEvent = {
  event: string
  level: LogLevel
  requestId?: string
  context?: Record<string, unknown>
}

const DEFAULT_AXIOM_BASE_URL = 'https://api.axiom.co/v1/datasets'

function getAxiomBaseUrl(): string {
  const configured = process.env.AXIOM_BASE_URL ?? DEFAULT_AXIOM_BASE_URL
  return configured.replace(/\/+$/, '')
}

export function resolveRequestId(providedId: string | null): string {
  if (providedId) {
    return providedId
  }

  return crypto.randomUUID()
}

export async function logAxiomEvent(event: LogEvent): Promise<void> {
  const dataset = process.env.AXIOM_DATASET
  const apiToken = process.env.AXIOM_API_TOKEN

  if (!dataset || !apiToken) {
    return
  }

  try {
    const axiomBaseUrl = getAxiomBaseUrl()
    await axios.post(
      `${axiomBaseUrl}/${dataset}/ingest`,
      [
        {
          timestamp: new Date().toISOString(),
          service: 'web',
          ...event
        }
      ],
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch {
    // Do not interrupt request lifecycle when telemetry fails.
  }
}
