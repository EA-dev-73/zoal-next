import React, { ReactChild } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../context/user";
import { LoginForm } from "./LoginForm";
import { Nav } from "./Nav";

type Props = {
  children?: ReactChild | ReactChild[];
  needsAuth?: boolean;
};

export const Layout = ({ children, needsAuth = false }: Props) => {
  const user = useRecoilValue(userState);
  const isLogged = user?.id;

  const handleAuth = (children?: ReactChild | ReactChild[]) => {
    if (!needsAuth || isLogged) {
      return (
        <div style={{ maxWidth: "99%", margin: "auto", paddingTop: "20px" }}>
          {children}
        </div>
      );
    } else {
      return <LoginForm />;
    }
  };

  return (
    <div>
      <Nav />
      <h1 className="title">ZOAL MNCH</h1>
      {handleAuth(children)}
      {needsAuth && isLogged && (
        <div
          style={{ position: "absolute", top: 0, right: 0, padding: "10px" }}
        >
          <a
            style={{ marginTop: 100 }}
            target="_blank"
            href="https://dashboard.stripe.com/test/dashboard"
            rel="noreferrer"
          >
            Dashboard Stripe (paiements)
          </a>
        </div>
      )}
    </div>
  );
};
