import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import { useCategories } from "../api/category";
import { cartState } from "../context/cart";
import { useLogOut } from "../utils/localStorageHelpers";
import { useIsAdmin } from "../utils/user";

export const Nav = () => {
  const cartContent = useRecoilValue(cartState);
  const userIsAdmin = useIsAdmin();
  const logOut = useLogOut();

  const { categories } = useCategories();

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      id="side-nav"
      role="navigation"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <Link passHref href="/">
            <span className="logo-sm d-block d-lg-none">ZOAL</span>
          </Link>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <div className="d-none d-lg-block" style={{ cursor: "pointer" }}>
              <Link passHref href="/">
                <Image
                  src="/images/nav-logo.jpg"
                  alt="logo"
                  className="img-profil img-fluid rounded-circle mx-auto mb-2"
                  width={200}
                  height={200}
                />
              </Link>
            </div>
            <span className="nav-item dropdown">
              <li className="nav-item">
                <Link passHref href="/shop">
                  <a
                    className="nav-link"
                    data-toggle="collapse"
                    data-target="#navbarNavDropdown"
                  >
                    Shop
                  </a>
                </Link>
                {(categories || []).map((category) => (
                  <li className="nav-item" key={category.id}>
                    <Link
                      passHref
                      href={`/shop?${category.name?.toLowerCase()}`}
                    >
                      <a className="nav-link">{category.name}</a>
                    </Link>
                  </li>
                ))}
              </li>
              <li className="nav-item">
                <Link passHref href="/panier">
                  <a className="nav-link">
                    Panier ({cartContent?.length || 0})
                  </a>
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
            </span>
          </ul>
        </div>
      </div>
    </nav>
  );
};
