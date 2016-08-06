import * as uuid from 'uuid'
import * as rs from '@respace/common'
import { asMap, observable, ObservableMap, action, computed } from 'mobx'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/debounceTime'

export type IAnnotation = rs.documents.IAnnotation
export type Document = rs.IComponentProps<rs.documents.ISourceCode, void>

class CommentStore {

  annotations: ObservableMap<IAnnotation>

  newAnnotation: IAnnotation = observable({
    posterName: 'Evan Sebastian',
    profileUrl: 'https://www.facebook.com/sbsevn',
    posterRole: 'Avenger',
    profilePicture: 'http://placekitten.com/200/300',
    value: '',
    createdAt: new Date()
  })

  @observable isEditMode = true

  private change$: Subject<string> = new Subject<string>()

  constructor(private document: rs.IDocument<rs.documents.ISourceCode>) {
    this.annotations = <any> observable(asMap({}))
    if (!document.data.annotations) {
      document.data.annotations = <any> this.annotations
      document.dispatch('save')
    } else {
      const annotations = document.data.annotations
      for (const key of Object.keys(annotations)) {
        if (annotations.hasOwnProperty(key)) {
          this.annotations.set(key, observable(annotations[key]))
        }
      }
    }
    this.change$.debounceTime(10).subscribe((value) => {
      this.newAnnotation.value = value
    })
  }

  newCommentChange(value: string) {
    this.change$.next(value)
  }

  @computed get allAnnotations(): IAnnotation[] {
    const annotations = this.annotations.values()
      .sort((a, b) => (b as any) - (a as any))
    return annotations
  }

  @action('comments:add')
  async addAnnotation() {
    const key = uuid.v4()
    const annotation = Object.assign({}, this.newAnnotation, {
      createdAt: new Date()
    })
    this.annotations.set(key, annotation)
    this.document.data.annotations[key] = annotation
    await this.document.dispatch('save')
    await this.document.dispatch('annotationAdded')
    this.newAnnotation.value = ''
  }
}

export default CommentStore
