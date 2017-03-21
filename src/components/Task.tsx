import * as React from 'react'

export interface ITaskProps {
  title: string
  description: string
}

export function Task({ title, description }: ITaskProps) {
  return (
    <div className="rs-task">
      <h1>{title}</h1>
      <blockquote>
        <p>
          {description}
        </p>
        <span className="rs-xp-inline">400XP</span>
      </blockquote>
    </div>
  )
}
