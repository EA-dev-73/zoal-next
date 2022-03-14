import Link from "next/link";
import React from "react";

export const Nav = () => {
  return (
    <>
      <Link href={"/"}>Zoal</Link> <Link href={"/shop"}>Shop</Link>{" "}
      <Link href={"/cart"}>Panier</Link>
    </>
  );
};
