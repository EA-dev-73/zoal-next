import React, { ReactChild, ReactChildren } from "react";
import { Nav } from "./Nav";

type Props = {
  children?: ReactChild | ReactChild[];
  pageTitle: string;
  isShop?: boolean;
};

export const Layout = ({ children, pageTitle, isShop = false }: Props) => {
  return (
    <div>
      <h1 style={{ color: isShop ? "red" : "black" }}>{pageTitle}</h1>
      <Nav />
      {children}
    </div>
  );
};
