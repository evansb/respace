import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import DocumentTree from '@respace/ui-document-tree'
import Editor from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import Comments from '@respace/ui-comments'
import Canvas from './Canvas'
import '@respace/theme-dark'

declare var window: any

window.onload = () => {
  const globals: string[] = []
  const context = {}

  function export_symbol(sym, value) {
    context[sym] = value
    globals.push(sym)
  }

  export_symbol('show', window.show);
  export_symbol('clear', window.clear);
  export_symbol('flip_horiz', window.flip_horiz);
  export_symbol('flip_vert', window.flip_vert);
  export_symbol('turn_upside_down', window.turn_upside_down);
  export_symbol('quarter_turn_left', window.quarter_turn_left);
  export_symbol('quarter_turn_right', window.quarter_turn_right);
  export_symbol('beside', window.beside);
  export_symbol('stack', window.stack);
  export_symbol('stackn', window.stackn);
  export_symbol('stack_frac', window.stack_frac);
  export_symbol('repeat_pattern', window.repeat_pattern);
  export_symbol('make_cross', window.make_cross);
  export_symbol('rcross_bb', window.rcross_bb);
  export_symbol('sail_bb', window.sail_bb);
  export_symbol('corner_bb', window.corner_bb);
  export_symbol('nova_bb', window.nova_bb);
  export_symbol('heart_bb', window.heart_bb);
  export_symbol('circle_bb', window.circle_bb);
  export_symbol('ribbon_bb', window.ribbon_bb);
  export_symbol('black_bb', window.black_bb);
  export_symbol('blank_bb', window.blank_bb);
  export_symbol('pentagram_bb', window.pentagram_bb);

  const saveHandler = function (action, document) {
    if (action === 'save') {
      console.log('Saved!')
      console.log(JSON.stringify(document))
      return Promise.resolve()
    } else {
      return Promise.resolve()
    }
  }

  const submitHandler = function (action, document) {
    if (action === 'submit') {
      console.log('Submitted!')
      console.log(JSON.stringify(document))
      return Promise.resolve()
    } else {
      return Promise.resolve()
    }
  }

  const testDocuments = [
    {
      type: 'source-code',
      meta: {
        id: 'Test',
        title: 'Test'
      },
      data: {
        template: 'function bar() { return 3; }',
        value: 'function foo() { return 2; }',
        annotations: {
          one: {
            createdAt: new Date(),
            posterName: 'Evan Sebastian',
            posterRole: 'Avenger',
            profileUrl: 'https://www.facebook.com/sbsevn',
            profilePicture: 'http://placekitten.com/200/300',
            value: 'Hello how are you'
          },
          two: {
            createdAt: new Date(),
            posterName: 'Some Dude',
            profileUrl: 'https://www.facebook.com/sbsevn',
            profilePicture: 'http://placekitten.com/200/300',
            value: 'Write comment *in* **markdown**'
          }
        }
      },
      handlers: [ saveHandler, submitHandler ],
      volatile: {
        context,
        globals
      }
    },
    {
      type: 'source-code',
      meta: {
        id: 'Test2',
        title: 'Test 2'
      },
      data: {
        template: 'function zap() { return 3; }',
        value: 'function zoo() { return 2; }'
      },
      handlers: [ saveHandler, submitHandler ]
    }
  ]

  const workspace = Workspace.create({
    components: [DocumentTree, Editor, Interpreter, Canvas, Comments],
    documents: testDocuments,
    layoutEngine: GoldenLayout
  })

  let container
  if (container = document.getElementById('root')) {
    workspace.render(container)
  }
}
