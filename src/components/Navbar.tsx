import * as React from 'react'

export function Navbar() {
  return (
    <nav className='pt-navbar pt-fixed-top'>
      <div className="pt-navbar-group pt-align-left">
        <button className='pt-button pt-minimal pt-active pt-icon-one-column'>
        </button>
        <div className="pt-navbar-heading">
           Respace
        </div>
      </div>
      <div className="pt-navbar-group pt-align-right">
          <button className='pt-button pt-intent-primary pt-icon-upload'>
            Submit
          </button>
      </div>
    </nav>
  )

}