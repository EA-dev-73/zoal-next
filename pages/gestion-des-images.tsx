import { Layout } from "../components/Layout";
import { Button, Container, FileInput, Select } from "@mantine/core";
import { useProductTypes } from "../api/products/product-type";
import { useMemo, useState } from "react";
import { ProductType } from "../types";
import {
  useProductTypesImages,
  useUploadProductTypeImagesToBucket,
} from "../api/images";
import { DisplayCurrentProductImages } from "../components/AdminProductsTable/DisplayCurrentProductPictures";

export default function GestionDesImages() {
  const { data: productTypes, isLoading, error } = useProductTypes();
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    ProductType["id"] | null
  >(null);

  const { mutate: uploadImages } = useUploadProductTypeImagesToBucket();
  const { data: currentImages } = useProductTypesImages({
    productsTypesIds: selectedProductTypeId ? [selectedProductTypeId] : [],
  });

  if (isLoading) {
    return <p>Chargement des produits</p>;
  }

  if (error) {
    return <p> Erreur au chargement des produits, contacter Tommy </p>;
  }

  return (
    <Layout needsAuth insideContainer={false}>
      <Container>
        <h1>Gestion des images</h1>
        <Select
          label="Pour quel produit ?"
          data={(productTypes || []).map((x) => ({
            value: x.id.toString(),
            label: x.name,
            group: x.productCategory.name,
          }))}
          onChange={(e) => setSelectedProductTypeId(Number(e))}
        />
        {selectedProductTypeId && (
          <>
            <FileInput
              label="Images à ajouter"
              withAsterisk
              placeholder=""
              multiple
              accept="image/*"
              disabled={!selectedProductTypeId}
              onChange={(images) =>
                uploadImages({
                  productTypeId: selectedProductTypeId,
                  images,
                })
              }
            />
            <div style={{ marginTop: "30px" }}>
              <p>Images actuelles: </p>
              <DisplayCurrentProductImages
                imagesUrls={currentImages[selectedProductTypeId]}
                productTypeId={selectedProductTypeId}
                isEdit
              />
            </div>
          </>
        )}
      </Container>
    </Layout>
  );
}
