import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import { cartState } from "../context/cart";
import { useLogOut } from "../utils/localStorageHelpers";
import { useIsAdmin } from "../utils/user";

export const Nav = () => {
  const cartContent = useRecoilValue(cartState);
  const userIsAdmin = useIsAdmin();
  const logOut = useLogOut();
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
        <span className="navbar-toggler-icon" />
      </button>

      <div id="navbarSupportedContent" className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link passHref href="/shop">
              <a className="nav-link">Shop</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link passHref href="/panier">
              <a className="nav-link">Panier ({cartContent?.length || 0})</a>
            </Link>
          </li>
          {userIsAdmin && (
            <ul className="navbar-nav">
              <li className="nav-item">___ADMIN___</li>
              <li className="nav-item">
                <Link passHref href="/gestion-des-produits">
                  <a className="nav-link">Produits</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link passHref href="/gestion-des-commandes">
                  <a className="nav-link">Commandes</a>
                </Link>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link"
                  onClick={logOut}
                  style={{ cursor: "pointer" }}
                >
                  Déconnexion
                </span>
              </li>
            </ul>
          )}
        </ul>
      </div>
    </nav>
  );
};
