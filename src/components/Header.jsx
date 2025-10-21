import "../styles/header.scss";
import menuIcon from "../assets/images/menu-icon.png";
import bagIcon from "../assets/images/bag-icon.png";
import logo from "../assets/images/stitch-logo.svg";

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <img src={menuIcon} alt="Menu" className="icon menu-icon" />
      </div>

      <div className="header__center">
        <img src={logo} alt="Logo" className="logo-img" />
        <p className="byline">by emma</p>
      </div>

      <div className="header__right">
        <nav className="nav-links">
          <a href="#">Shop</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
        <div className="bag-wrapper">
          <img src={bagIcon} alt="Bag" className="icon bag-icon" />
          <span className="bag-count">0</span>
        </div>{" "}
      </div>
    </header>
  );
}

export default Header;
