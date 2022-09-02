import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useProductTypesWithImages } from "../../api/products/product-type";
import { Layout } from "../../components/Layout";
import { Product, ProductType } from "../../types";
import { displayToast } from "../../utils/displayToast";
import { useAddProductIdToCart } from "../../utils/localStorageHelpers";
import styles from "../../styles/ArticlePage.module.css";
import { DisplayArticlePageImages } from "../../components/DisplayArticlePageImages";
import { isMobile } from "react-device-detect";
import { reduceProductAvailableSizes } from "../../utils/reduceProductAvailableSizes";

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const productTypeId = Number(id);
  const addProductToCart = useAddProductIdToCart();

  const { isLoading, productTypesWithImages } = useProductTypesWithImages();

  const productImages = useMemo(() => {
    return (productTypesWithImages || []).find((x) => x.id === productTypeId)
      ?.imagesUrls;
  }, [productTypeId, productTypesWithImages]);

  const productType = useMemo(() => {
    return (productTypesWithImages || []).find((x) => x.id === productTypeId);
  }, [productTypeId, productTypesWithImages]);

  const [selectedSize, setSelectedSize] = useState<string>(
    () => reduceProductAvailableSizes(productType as ProductType)?.[0]
  );
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const availableSizes = useMemo(() => {
    const sizes = reduceProductAvailableSizes(productType as ProductType);
    const options = [];
    for (let i = 0; i < sizes?.length; i++) {
      options.push(<option value={sizes[i]}>{sizes[i]}</option>);
    }
    return options;
  }, [productType]);

  const productFromSelectedSize = useMemo(
    () => (productType?.products || []).find((x) => x.size === selectedSize),
    [productType?.products, selectedSize]
  );

  const maxQuantityForSize = useMemo(() => {
    return productFromSelectedSize?.stock;
  }, [productFromSelectedSize?.stock]);

  const handleAdd = () => {
    if (!productType || !selectedSize || !productFromSelectedSize) return;
    displayToast({
      type: "success",
      message: "Article ajouté au panier",
    });
    addProductToCart(productFromSelectedSize?.id, selectedQuantity);
  };

  if (isLoading) {
    return (
      <Layout>
        <p>Chargement du produit</p>
      </Layout>
    );
  }

  if (!productType?.products?.length) {
    return (
      <Layout>
        <p>Produit victime de son succès... pour le moment 🤔</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={isMobile ? "" : "d-flex justify-content-between"}>
        <div className={isMobile ? "" : styles.leftBlock}>
          {isMobile ? <h2>{productType.name}</h2> : null}
          <DisplayArticlePageImages imagesUrls={productImages || []} />
        </div>
        <div className={isMobile ? styles.mobile : styles.rightBlock}>
          <div className={isMobile ? "" : styles["stick-to-bottom"]}>
            {!isMobile ? (
              <h2 className={styles["product-name"]}>{productType.name}</h2>
            ) : null}

            <label htmlFor="select-size" className="mb-0">
              Taille
            </label>
            <select
              className="form-select"
              aria-label="Sélection de la taille souhaitée"
              id="select-size"
              value={selectedSize ? selectedSize : ""}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {availableSizes}
            </select>
            <label htmlFor="select-size" className="mb-0">
              Quantité
            </label>
            <input
              id="select-quantity"
              type="number"
              className="form-control"
              placeholder="Quantité"
              aria-label="Sélection de la quantité souhaitée"
              aria-describedby="Sélection de la quantité souhaitée"
              min={1}
              max={maxQuantityForSize}
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
            />

            <button
              role="button"
              className="btn btn-outline-success mt-3 mb-4"
              onClick={handleAdd}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ProductPage;
