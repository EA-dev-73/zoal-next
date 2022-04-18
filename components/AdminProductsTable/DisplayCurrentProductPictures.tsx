import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { deleteImages } from "../../api/images";
import { ProductType, ProductTypeWithImages } from "../../types";

type Props = {
  productTypeId?: ProductType["id"];
  imagesUrls: ProductTypeWithImages["imagesUrls"];
  isEdit?: boolean;
};

export const DisplayCurrentProductImages = ({
  productTypeId,
  imagesUrls = [],
  isEdit = true,
}: Props) => {
  const router = useRouter();
  const handleDelete = async (imageUrl: string) => {
    if (!productTypeId) {
      alert("Missing productTypeId... tommy you suck");
      return;
    }
    const imageName = imageUrl.split("/")[imageUrl.split("/").length - 1];
    await deleteImages([
      {
        productTypeId,
        imageName,
      },
    ]);
    router.reload();
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {imagesUrls.map((imageUrl) => (
        <div
          key={imageUrl}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Image
            src={imageUrl}
            width={100}
            height={100}
            alt={`Image ${imageUrl}`}
          />
          {isEdit && (
            <button
              role="button"
              className="btn btn-outline-danger my-3 "
              onClick={() => handleDelete(imageUrl)}
            >
              Supprimer
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
