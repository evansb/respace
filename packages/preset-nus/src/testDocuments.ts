import createMission2 from './createMission2'
import createMission3 from './createMission3'

const mission2 = createMission2()
const mission3 = createMission3()

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
    return Promise.resolve()
  } else {
    return Promise.resolve()
  }
}

export default [
{
  type: 'source-code',
  meta: {
    id: 'Rune 3D',
    title: 'Rune 3D',
    submitted: false
  },
  data: {
    template: '',
    value: '',
  },
  handlers: [ saveHandler, submitHandler ],
  volatile: {
    mission_type: 'rune_3d',
    context: window,
    globals: mission3.globals.concat(['Math', 'alert'])
  }
},
{
  type: 'source-code',
  meta: {
    id: 'Rune 2D',
    title: 'Rune 2D',
    submitted: false
  },
  data: {
    mission_type: 'rune_2d',
    template: '',
    value: '',
  },
  handlers: [ saveHandler, submitHandler ],
  volatile: {
    // Description: '<pre>\\(1 + x = 3\\)\n\\[1 + x = 3\\]\n</pre>',
    context: window,
    globals: mission2.globals.concat(['Math', 'alert'])
  }
},
{
  type: 'source-code',
  meta: {
    id: 'Source Week 3',
    title: 'Source Week 3',
    submitted: false
  },
  data: {
    template: '',
    value: ''
  },
  volatile: {
    context: window,
    globals: ['Math', 'alert']
  },
  handlers: [ saveHandler, submitHandler ]
}
]
