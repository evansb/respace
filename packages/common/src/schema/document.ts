/**
 * Base JSON schema for all Respace documents.
 * @type {{tv4.JsonSchema}}
 */
const schema: tv4.JsonSchema = {
  title: 'Respace Base Document Schema',
  description: 'Base JSON Schema for Respace Documents',
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  properties: {
    type: { type: 'string' },
    meta: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        color: {
          type: 'string',
          'enum': ['red', 'orange',
            'yellow', 'green',
            'blue', 'violet', 'purple']
        }
      },
      data: {
        type: 'object'
      }
    },
  },
  // Additional properties are ignored
  additionalProperties: true,
  required: ['type', 'data']
}

export default schema
