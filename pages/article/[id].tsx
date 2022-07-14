import { NextPageContext } from "next";
import Image from "next/image";
import { useMemo, useState } from "react";
import { getProductImages } from "../../api/images";
import { fetchProductTypeById } from "../../api/products/product-type";
import { Layout } from "../../components/Layout";
import { getStock } from "../../components/SizePicker/lib";
import { SizePicker } from "../../components/SizePicker/SizePicker";
import { Product, ProductType } from "../../types";
import { useAddProductIdToCart } from "../../utils/localStorageHelpers";

type Props = {
  productType: ProductType;
  images: string[];
};

const ProductPage = ({ productType, images }: Props) => {
  const addProductToCart = useAddProductIdToCart();
  const [selectedSize, setSelectedSize] = useState<Product["size"] | null>(
    productType.products[0].size || null
  );

  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const stockForSize = useMemo(() => {
    if (!selectedSize) return 0;
    return getStock(productType, selectedSize);
  }, [productType, selectedSize]);

  return (
    <Layout>
      <div
        style={{ display: "flex", justifyContent: "left", flexWrap: "wrap" }}
      >
        <div style={{ width: "75%", marginLeft: "50px" }}>
          <h2>Images</h2>
          {images.map((image) => (
            <div key={image}>
              <Image src={image} alt={image} width={500} height={500} />
            </div>
          ))}
        </div>
        <div>
          <h2>Texte</h2>
          <SizePicker
            sizes={productType.products.map((x) => x.size)}
            onClick={setSelectedSize}
            selectedSize={selectedSize}
            productType={productType}
          />
          <input
            type="number"
            name=""
            id=""
            defaultValue={1}
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
          />
          <button
            onClick={() => addProductToCart(productType.products[0].id)}
            disabled={stockForSize < selectedQuantity}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </Layout>
  );
};
export default ProductPage;

export const getServerSideProps = async (context: NextPageContext) => {
  const productType = await fetchProductTypeById(Number(context.query.id));
  const images = productType?.id ? await getProductImages(productType.id) : [];
  return { props: { productType, images } };
};
