import Link from "next/link";
import React from "react";

export const Nav = () => {
  return (
    <>
      <Link href={"/"}>accueil</Link> <Link href={"/shop"}>Shop</Link>
    </>
  );
};
