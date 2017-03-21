import { createAndRender } from '../../src/index'
import { IInitializer } from '../../src/initializer'

const tasks = [
  {
    description: 'This is an example of a guided task.',
    fragment: 0,
    guided: true,
    id: 0,
    title: 'Values, Expression, and Functions'
  },
  {
    description: 'This is an example of a non-guided task (old CS1101S style)',
    fragment: 4,
    guided: false,
    id: 1,
    title: 'Understanding Recursion'
  }
]

const container = document.getElementById('root') || document.body

const initializer: IInitializer = {
  api: {
    tasks: {
      fetch() {
        return Promise.resolve(tasks)
      }
    }
  }
}

createAndRender(container, initializer)
