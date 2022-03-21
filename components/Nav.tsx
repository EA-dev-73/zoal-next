import Image from "next/image";
import Link from "next/link";
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
            <Link passHref href="/admin">
              <a>Admin</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
