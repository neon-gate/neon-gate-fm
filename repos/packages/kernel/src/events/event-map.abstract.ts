/**
 * Subject-to-payload event contract used across services.
 *
 * Historical service code treats `EventMap` as a plain indexable interface,
 * so the kernel keeps that contract instead of forcing mapper classes.
 */
export interface EventMap {
  [eventName: string]: Record<string, unknown>
}
