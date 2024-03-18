export function generateState(): string {
  // Generate a random string for state
  return Math.random().toString(36).substring(2, 15);
}
