/**
 * Base JSON schema for all Respace source code.
 * @type {{tv4.JsonSchema}}
 */
export const SourceCodeSchema: tv4.JsonSchema = {
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

export interface IAnnotation {
  createdAt: Date
  posterName: string
  posterRole?: string
  profilePicture?: string
  profileUrl?: string
  line?: number
  lineEnd?: number
  column?: number
  columnEnd?: number
  value: string
}

export interface ISourceCode {
  template: string
  description: string
  value: string
  annotations: {
    [id: string]: IAnnotation
  }
}
