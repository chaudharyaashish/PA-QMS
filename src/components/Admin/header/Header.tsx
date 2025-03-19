
import "./Header.css"

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
      <span className="text-xl font-semibold">
                <span className="text-green-800">PA</span> & {""}
                <span className="text-green">QMS</span>
              </span>
      </div>
    </header>
  )
}

export default Header
