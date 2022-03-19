
export function validVariableName(name: string): boolean {
  return new RegExp("[a-zA-Z0-9_]+", "g").test(name)
}

export function createValidNumberLiteral(v: number): string {
  return (v % 1) === 0 ? v + "." : v + ""
}