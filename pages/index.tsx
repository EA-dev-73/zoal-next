import type { NextPage } from "next";
import Image from "next/image";
import { Layout } from "../components/Layout";
import zolaImage from "../public/zola.jpg";

const Home: NextPage = () => {
  return (
    <Layout pageTitle="Zoal">
      <h1>Présentation</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, tempore
        enim? Temporibus, dicta reprehenderit ipsam, vitae ab perferendis nihil
        saepe libero aliquid qui autem corporis cupiditate reiciendis corrupti
        voluptatem totam!
      </p>
      <Image src={zolaImage} alt="zola-image" />
    </Layout>
  );
};

export default Home;
