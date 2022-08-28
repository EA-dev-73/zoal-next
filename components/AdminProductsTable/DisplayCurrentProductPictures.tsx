import Image from "next/image";
import React from "react";
import { useDeleteImages } from "../../api/images";
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
  const { mutate: deleteImages } = useDeleteImages();
  const handleDelete = async (imageUrl: string) => {
    if (!productTypeId) {
      alert("Missing productTypeId... tommy you suck");
      return;
    }
    const imageName = imageUrl.split("/")[imageUrl.split("/").length - 1];
    deleteImages([
      {
        productTypeId,
        imageName,
      },
    ]);
  };
  return (
    <div className="d-flex flex-wrap">
      {imagesUrls.map((imageUrl) => (
        <div key={imageUrl} className="d-flex flex-column">
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
