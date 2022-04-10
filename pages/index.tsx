import type { NextPage } from "next";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <h1>Présentation</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, tempore
        enim? Temporibus, dicta reprehenderit ipsam, vitae ab perferendis nihil
        saepe libero aliquid qui autem corporis cupiditate reiciendis corrupti
        voluptatem totam!
      </p>
    </Layout>
  );
};

export default Home;
