import React, { ReactChild } from "react";
import { Nav } from "./Nav";

type Props = {
  children?: ReactChild | ReactChild[];
};

export const Layout = ({ children }: Props) => {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
};
