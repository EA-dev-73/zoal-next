import React, { ReactChild, ReactChildren } from "react";
import { Nav } from "./Nav";

type Props = {
  children?: ReactChild | ReactChild[];
  pageTitle: string;
};

export const Layout = ({ children, pageTitle }: Props) => {
  return (
    <div style={{ margin: "30px" }}>
      <h1>{pageTitle}</h1>
      <Nav />
      {children}
    </div>
  );
};
