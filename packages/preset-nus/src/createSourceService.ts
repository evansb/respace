import uuid from 'uuid'
import { Snapshot, ISnapshotError, printErrorToString, createServer, IRequest,
  printValueToString, listToString } from 'the-source'
import { Subject } from 'rxjs/Subject'
import { service } from '@respace/ui-interpreter'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/share'

declare var window: any

function weekOfLanguage(language: string): number {
  if (/source-week/.test(language)) {
    return parseInt(language.split('-')[2], 10)
  } else if (/rune/.test(language)) {
    return 4
  } else if (/rsa/.test(language)) {
    return 5
  } else if (typeof window.interpreter === 'number') {
    return window.interpreter
  } else {
    return 3
  }
}

function createRuntimeObject() {
  const defaultTimeout = parseInt(window.timeout, 10) || 10000
  const runtime_limit = {
    id: uuid.v4(),
    stackSize: 65536,
    timeout: defaultTimeout,
    set_stack_size(stackSize) {
      if (stackSize > 0) {
        this.stackSize = stackSize
      } else {
        throw new Error('Stack size must be >0')
      }
    },
    get_stack_size()  {
      return this.stackSize
    },
    get_timeout()  {
      return this.timeout
    },
    set_timeout(timeout) {
      if (timeout > 0) {
        this.timeout = timeout
      } else {
        throw new Error('Timeout must be >0')
      }
    }
  }
  const system = { runtime_limit, get_globals: () => '' }
  return system
}

export default function createSourceService(init: {
  language: string
  context: any
  globals: string[]
}): service.ILanguageService<Snapshot, ISnapshotError> {
  const requests$ = new Subject<IRequest>()
  const outputSink$ = new Subject<string>()
  const server = createServer(requests$).share()

  const system = createRuntimeObject()
  init.context.system = system
  init.globals.push('system')

  return {
    language: init.language,
    outputSink: outputSink$,
    publish(action: service.SnapshotAction<Snapshot, ISnapshotError>) {
      if (action.type === 'snapshotRequest') {
        const actionRequest = <service.SnapshotRequest<Snapshot>> action
        const { id, code, parent } = actionRequest.payload
        const week = weekOfLanguage(init.language)
        let request: IRequest = { id, code, week }
        if (!parent) {
          request.globals = init.globals
          request.context = init.context
          if (week >= 4) {
            request.globals.push('display')
            request.context.display = (value) => {
              let str: string
              if (value instanceof Array) {
                str = listToString(value)
              } else if (typeof value.toString === 'function') {
                str = value.toString()
              } else {
                str = value + ''
              }
              outputSink$.next(str)
            }
            window['display'] = request.context.display
          }

          const globals = request.globals || []
          system.get_globals = () => {
            let str = ''
            for (var x = 0; x < globals.length; x++) {
              if (x !== globals.length - 1) {
                str += globals[x] + '\n'
              } else {
                str += globals[x]
              }
            }
            return str
          }
        } else {
          request.parent = parent
        }
        request.timeout = system.runtime_limit.get_timeout()
        request.maxCallStack = system.runtime_limit.get_stack_size()
        requests$.next(request)
      }
    },
    subscribe(handler) {
      return server.map(snapshotOrError => {
        if (snapshotOrError instanceof Snapshot) {
          return { type: 'snapshotReply', payload: snapshotOrError }
        } else {
          return { type: 'snapshotError', payload: snapshotOrError }
        }
      }).subscribe(handler)
    },
    errorToString(error: ISnapshotError) {
      return printErrorToString(error)
    },
    valueToString(snapshot: Snapshot) {
      return printValueToString(snapshot.value, snapshot.context)
    }
  }
}
