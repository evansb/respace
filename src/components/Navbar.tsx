import * as React from 'react'

export function Navbar() {
  return (
    <nav className="pt-navbar">
      <div className="pt-navbar-group pt-align-left">
        <button className="pt-button pt-minimal pt-icon-one-column" />
        <span className="pt-navbar-divider"></span>
        <div className="pt-navbar-heading">
          Page Title
        </div>
      </div>
      <div className="pt-navbar-group pt-align-right">
      </div>
    </nav>
  )
}