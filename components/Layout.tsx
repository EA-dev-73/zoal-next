import React, { ReactChild } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../context/user";
import { LoginForm } from "./LoginForm";
import { Nav } from "./Nav";
import { isMobile } from "react-device-detect";

type Props = {
  children?: ReactChild | ReactChild[];
  needsAuth?: boolean;
  insideContainer?: boolean;
};

export const Layout = ({
  children,
  needsAuth = false,
  insideContainer = false,
}: Props) => {
  const user = useRecoilValue(userState);
  const isLogged = user?.id;

  const handleAuth = (children?: ReactChild | ReactChild[]) => {
    if (!needsAuth || isLogged) {
      return <div className="page-container">{children}</div>;
    } else {
      return <LoginForm />;
    }
  };

  return (
    <div className={insideContainer && !isMobile ? "main-layout" : ""}>
      <Nav />
      <h1 className="title">ZOAL MNCH</h1>
      {handleAuth(children)}
      {needsAuth && isLogged && (
        <div className="stripe-link-container">
          <a
            className="btn btn-success"
            href="https://dashboard.stripe.com/test/dashboard"
            target="_blank"
            rel="noreferrer"
            role="button"
          >
            Dashboard Stripe (paiements)
          </a>
        </div>
      )}
    </div>
  );
};
