import * as React from 'react'
import { printValueToString } from 'the-source'
import { ISnapshotData } from '../store'

function SnapshotItem(props: { snapshotData: ISnapshotData }) {
  const value = props.snapshotData.snapshot.value
  const errors = props.snapshotData.errors.map(e => {
    return <div>{e.from + e.message}</div>
  })
  return (
    <div>
      <div>{printValueToString(value)}</div>
      {errors}
    </div>
  )
}

export default SnapshotItem
