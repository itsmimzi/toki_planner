import React from "react";
import logoHome from "../logo/logoHome4.png";
import NavBar from "./NavBar";

const Header = ( ) => {

  return (
    <div>
      <div className="header-wrapper">
        <div className="header-box">
          <div className="logo-home">
            <a href='/home'><img className="img-logo-home" src={logoHome} alt="logoHome" /></a>
          </div>
          <NavBar/>
        </div>
      </div>
    </div>
  );
};

export default Header;
