// Simple nanoid implementation for token generation
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function nanoid(size: number = 8): string {
  let id = ''
  for (let i = 0; i < size; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return id
}
