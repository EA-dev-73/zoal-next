import { sign } from "crypto";
import { useRouter } from "next/router";
import React, { FormEventHandler, SyntheticEvent, useState } from "react";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import { signIn } from "../api/user-api";
import { userState } from "../context/user";

function Connexion() {
  const setUser = useSetRecoilState(userState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: SyntheticEvent<any>) => {
    e.preventDefault();
    const { user, error } = await signIn({
      email: e.currentTarget["email"].value,
      password: e.currentTarget["password"].value,
    });
    if (error) {
      setError(error.message);
    } else {
      console.log({ user });
      setUser(user);
      router.replace("/admin");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" />
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Se connecter</button>
      </form>
      {error && <strong style={{ color: "red" }}>{error}</strong>}
    </>
  );
}

export default Connexion;
