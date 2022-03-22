export function validVariableName(name: string): boolean {
  return /^[a-zA-Z0-9_]+$/.test(name)
}

export function createValidNumberLiteral(v: number): string {
  return (v % 1) === 0 ? `${v}.` : `${v}`
}
