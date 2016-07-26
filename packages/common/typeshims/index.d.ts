
declare module 'uuid' {
  namespace _uuid {
    export function v4(): string
  }
  export = _uuid
}
