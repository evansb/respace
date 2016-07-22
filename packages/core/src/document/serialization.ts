import * as tv4 from 'tv4'

export function deserialize<T>(json: any, schema?: JsonSchema): IDocument<T> {
  if (!json.data) { throw new Error('Not an object') }
  const base = tv4.validateResult(json, baseSchema)
  if (!base.valid) {
    throw new Error('Not a valid document')
  }
  if (schema) {
    const result = tv4.validateResult(json.data, schema)
    if (!result.valid) {
      throw new Error(result.error.toString())
    }
  }
  return <IDocument<T>> (json)
}
