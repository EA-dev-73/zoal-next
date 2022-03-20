import Image from "next/image";
import React from "react";

export const Nav = () => {
  return (
    <nav
      id="side-nav"
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      role="navigation"
    >
      <a className="navbar-brand" />
      <a className="navbar-brand">
        <span className="logo-sm d-block d-lg-none">ZOAL</span>
        <span className="d-none d-lg-block">
          {/* <img
            className="img-profil img-fluid rounded-circle mx-auto mb-2"
            src="/uploads/lesBellesImages/Illustration_sans_titre.jpg"
            alt="Photo de profil"
          /> */}
          <Image
            src="/images/nav-logo.jpg"
            alt="Photo de profil"
            className="img-profil img-fluid rounded-circle mx-auto mb-2"
            width={200}
            height={200}
          />
        </span>
      </a>
      <button
        id="menuMobil"
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div id="navbarSupportedContent" className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="link">
              projet perso
              {/* <img
                className="nav-link"
                src="/uploads/lesBellesImages/projetPerso.png"
              /> */}
            </a>
          </li>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="link-subtype">
                illustration
                {/* <img
                  className="nav-link subtype"
                  src="/uploads/lesBellesImages/Illustration.png"
                  ref="#"
                /> */}
              </a>
            </li>
            <li className="nav-item">
              <a className="link-subtype">
                bd
                {/* <img
                  className="nav-link subtype"
                  src="/uploads/lesBellesImages/BD.png"
                  ref="#"
                /> */}
              </a>
            </li>
            <li className="nav-item">
              <a className="link-subtype">
                croquis
                {/* <img
                  className="nav-link subtype"
                  src="/uploads/lesBellesImages/croquis.png"
                  ref="#"
                /> */}
              </a>
            </li>
          </ul>
          <li className="nav-item">
            <a className="link">tatouage</a>
          </li>
          <li className="nav-item">
            <a className="link">
              prestation
              {/* <img
                className="nav-link"
                src="/uploads/lesBellesImages/Presta.png"
                ref="#"
              /> */}
            </a>
          </li>
          <li className="nav-item">
            <a className="link">
              atelier
              {/* <img
                className="nav-link"
                src="/uploads/lesBellesImages/Ateliers.png"
                ref="#"
              /> */}
            </a>
          </li>
          <li className="nav-item">
            <a className="link">contact</a>
          </li>
          <li className="nav-item">
            <a target="_blank">
              {/* <img
                className="logo-nav"
                src="/uploads/lesBellesImages/instagram.png"
                title="lien instagram"
              /> */}
            </a>
            <a target="_blank">
              {/* <img
                className="logo-nav"
                src="/uploads/lesBellesImages/facebook2.png"
                title="lien facebook"
              /> */}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
