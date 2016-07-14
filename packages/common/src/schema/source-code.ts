/**
 * Base JSON schema for all Respace source code.
 * @type {{tv4.JsonSchema}}
 */
const schema: tv4.JsonSchema = {
  title: 'Respace Source Code Schema',
  description: 'JSON Schema for Respace Source Code',
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  properties: {
    template: {
      description: 'Value when the user revert the code',
      type: 'string',
      'default': ''
    },
    value: {
      description: 'Current value',
      type: 'string'
    }
  },
  // Additional properties are ignored
  additionalProperties: true,
  required: ['value']
}

export default schema
