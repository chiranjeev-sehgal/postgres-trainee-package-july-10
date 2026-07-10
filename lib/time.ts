export const DEFAULT_REFERENCE_NOW = "2026-02-01T12:00:00.000Z";

export function getControlledNow(): Date {
  return new Date(process.env.REFERENCE_NOW ?? DEFAULT_REFERENCE_NOW);
}
