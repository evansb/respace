export enum DocumentColor {
  Red, Orange, Yellow, Green, Blue, Violet, Purple
}

export interface IDocumentMeta {
  id: string,
  title?: string,
  color?: DocumentColor
}

export type DocumentHandler<T> = (action: string,
    document: IDocumentJSON<T>) => Promise<{}>

export interface IDocumentJSON<T> {
  type: string
  meta: IDocumentMeta
  data: T
  handlers?: DocumentHandler<T>[]
  volatile?: any
}

export interface IDocument<T> extends IDocumentJSON<T> {
  type: string
  id: string
  title: string

  dispatch(action: string): Promise<{}>
  addHandler(callback: DocumentHandler<T>)
}

export type AnyDocument = IDocument<any>
export type AnyDocumentJSON = IDocumentJSON<any>
