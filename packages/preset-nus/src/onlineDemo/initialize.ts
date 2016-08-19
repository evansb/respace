import initializeRespace from '../initialize'
import loadLibraries from '../loadLibraries'

function createSourceWeek(week: number) {
  const id = `source-week-${week}`
  const title = `Source Week ${week}`
  return {
    type: 'source-code',
    meta: { id, title },
    data: { template: '', value: '' },
    volatile: { week },
    handlers: []
  }
}

async function createSpecial(missionName: string, displayName: string,
                             week: number) {
  const id = missionName
  const title = displayName
  const { globals, context } = await loadLibraries(missionName)
  return {
    type: 'source-code',
    meta: { id, title },
    data: { template: '', value: '' },
    volatile: { week, globals, context }
  }
}

export default async function initialize() {
  const documents = [
    createSourceWeek(3),
    await createSpecial('Mission 2', 'Rune 2D', 3),
    await createSpecial('Mission 3', 'Rune 3D', 3)
  ]
  initializeRespace(documents)
}
