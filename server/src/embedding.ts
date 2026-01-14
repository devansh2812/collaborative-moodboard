// Deterministic lightweight embedding to avoid external ML dependencies.
// Replace with a real model if desired; keep vector length 64.

const VECTOR_SIZE = 64;

export function textToVector(input: string): number[] {
  const vec = new Array<number>(VECTOR_SIZE).fill(0);
  const text = input.normalize('NFKD');
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const bucket = code % VECTOR_SIZE;
    vec[bucket] += (code % 31) / 31; // distribute small weight
  }
  // Normalize to unit length
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
}

export function vectorToPg(vector: number[]): string {
  return `[${vector.join(',')}]`;
}

