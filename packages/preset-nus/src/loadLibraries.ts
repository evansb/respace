import $ from 'jquery'

declare interface WindowWithExportSymbol extends Window {
  export_symbol: any
}

declare var window: WindowWithExportSymbol

const baseLib = 'https://source-academy-assets.s3.amazonaws.com/lib'

const __LIBRARY_CACHE__: { [index: string]: boolean } = {}

async function getScript(libraryName: string) {
  console.log(`Loading ${libraryName}`)
  return new Promise((resolve, reject) => {
    if (__LIBRARY_CACHE__[libraryName]) {
      console.log(`Cache hit ${libraryName}`)
      resolve()
    } else {
      $.getScript(`${baseLib}/${libraryName}`).then(() => {
        __LIBRARY_CACHE__[libraryName] = true
        console.log(`Loaded ${libraryName}`)
        resolve()
      }).fail(reject)
    }
  })
}

interface IMissionMetadata {
  interpreter: number
  libraries: string[]
}

function getMetadata(missionTitle: string): Promise<IMissionMetadata> {
  return new Promise((resolve, reject) => {
    $.getJSON(`${baseLib}/${missionTitle}.json`).then((data, status) => {
      resolve(data as IMissionMetadata)
    }).fail(reject)
  })
}

function isValidLibrary(json: any) {
  return json.libraries instanceof Array &&
    (<any[]> json.libraries).every(s => typeof s === 'string')
}

export default async function loadLibraries(missionTitle: string) {
  missionTitle = missionTitle.toLowerCase().replace(' ', '-')
  console.log(`Mission: ${missionTitle}`)
  let globals: string[] = []
  let context: {[name: string]: any} = {}
  const json: { libraries: string[] } = await getMetadata(missionTitle)
  if (isValidLibrary(json)) {
    await Promise.all(json.libraries.map(getScript))
  }
  window.export_symbol = (s, m) => {
    globals.push(s)
    context[s] = m
  }
  await getScript(missionTitle + '.js')
  return { globals, context }
}
