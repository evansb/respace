
/**
 * Deserialize and reify a JSON type into the document type.
 *
 * @param json any json data.
 * @param schema the json schema used
 * @return a document or the error if refinement failed
 */
export function deserialize<T>(json: any, schema: JsonSchema):
(IDocument<T> | Error) {
  if (!json.data) { return new Error('Not an object') }
  const base = tv4.validateResult(json, baseSchema)
  if (!base.valid) {
    return new Error('Not a valid document')
  }
  const result = tv4.validateResult(json.data, schema)
  if (!result.valid) {
    return new Error(result.error.toString())
  }
  return <IDocument<T>> (json)
}
