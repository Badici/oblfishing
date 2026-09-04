const DIGIT_RE = /[^\d+]/g;

/**
 * Accepts common Romanian mobile formats:
 * 0728 241 412, 0728241412, +40 728 241 412, 0040728241412
 */
export function isValidRoPhone(input: string): boolean {
  const compact = input.replace(DIGIT_RE, "");
  if (!compact) return false;

  if (/^07\d{8}$/.test(compact)) return true;
  if (/^\+407\d{8}$/.test(compact)) return true;
  if (/^00407\d{8}$/.test(compact)) return true;
  if (/^407\d{8}$/.test(compact)) return true;

  return false;
}

export function normalizePhoneDisplay(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
