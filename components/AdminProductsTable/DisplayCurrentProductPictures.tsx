import Image from "next/image";
import React from "react";
import { useDeleteImage } from "../../api/images";
import { ProductType, ProductTypeWithImages } from "../../types";
import { displayToast } from "../../utils/displayToast";

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
  const { mutate: deleteImage } = useDeleteImage();
  const handleDelete = async (imageUrl: string) => {
    if (!productTypeId) {
      displayToast({
        type: "error",
        message: "Il manque le productTypeId... voir avec tommy",
      });
      return;
    }
    const imageName = imageUrl.split("/")[imageUrl.split("/").length - 1];
    deleteImage({
      productTypeId,
      imageName,
    });
  };
  return (
    <div className="d-flex flex-wrap justify-content-around">
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
