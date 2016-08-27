import uuid from 'uuid'
import { computed, action } from 'mobx'
import { Document, IDocumentJSON } from '../document'

export interface ISourceCode {
  readOnly?: boolean
  language: string
  template: string
  value: string
}

export namespace Actions {
  export type All = Run | Save
  export type Run = { type: 'run' }
  export type Save = { type: 'save', payload: string }

  export function run(): Run {
    return { type: 'run' }
  }
}

export class SourceCode extends Document<ISourceCode, Actions.All> {
  static type = 'source-code'

  constructor(value: string, template?: string, language?: string,
              title?: string)
  constructor(json: string | IDocumentJSON<ISourceCode>,
              template?: string, language?: string,
              title?: string) {
    if (typeof json === 'object') {
      super(json)
    } else {
      super({
        type: SourceCode.type,
        meta: { id: uuid.v4(), title, group: title },
        data: {
          language: language || 'javascript',
          template: template || '',
          value: json || ''
        }
      })
    }
    this.subscribe(action => {
      if (action.type === 'save') {
        const value = (<Actions.Save> action).payload
        this.data.value = value
        this.saveLocal()
      }
      return undefined
    })
  }

  @computed get value() {
    return this.data.value
  }

  @action('sourceCode.setValue')
  setValue(newValue: string) {
    this.data.value = newValue
  }

  @computed get template() {
    return  this.data.template
  }

  @computed get isReadOnly() {
    return this.data.readOnly
  }

  @computed get language() {
    return this.data.language
  }

  setReadOnly(enabled: boolean) {
    this.data.readOnly = enabled
  }
}
