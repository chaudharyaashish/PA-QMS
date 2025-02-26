import { BellIcon } from "lucide-react"
import "./Header.css"

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h2 className="header-title">PA & QMS</h2>
        <button className="notification-button">
          <BellIcon className="notification-icon" />
        </button>
      </div>
    </header>
  )
}

export default Header
