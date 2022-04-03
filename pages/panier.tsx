import { CartRecap } from "../components/CartRecap";

export default function Panier() {
  return (
    <div>
      <h1>Contenu du panier</h1>
      <CartRecap isRecap={false} />
    </div>
  );
}
