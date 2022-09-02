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
import { ArticleIdForm } from "../../utils/articleIdForm";

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

  const noStock = useMemo(() => {
    if (!productFromSelectedSize) return true;
    return productFromSelectedSize?.stock < 1;
  }, [productFromSelectedSize]);

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

  return (
    <Layout>
      <div className={isMobile ? "" : "d-flex justify-content-between"}>
        <div className={isMobile ? "" : styles.leftBlock}>
          {isMobile ? (
            <h2>{productType?.name || "Produit indisponible"}</h2>
          ) : null}
          <DisplayArticlePageImages imagesUrls={productImages || []} />
        </div>
        <div className={isMobile ? styles.mobile : styles.rightBlock}>
          {!productType?.products?.length || noStock ? (
            <p className="text-center my-4">Plus de stocks disponible</p>
          ) : (
            <ArticleIdForm
              productType={productType}
              availableSizes={availableSizes}
              handleAdd={handleAdd}
              maxQuantityForSize={maxQuantityForSize}
              selectedQuantity={selectedQuantity}
              setSelectedQuantity={setSelectedQuantity}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};
export default ProductPage;
