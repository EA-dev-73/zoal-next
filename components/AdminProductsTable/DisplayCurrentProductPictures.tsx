import Image from "next/image";
import React, { useState } from "react";
import { useDeleteImage } from "../../api/images";
import { ProductType, ProductTypeWithImages } from "../../types";
import { displayToast } from "../../utils/displayToast";
import ImageViewer from "react-simple-image-viewer";

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
  const [showPreview, setShowPreview] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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
      {imagesUrls.map((imageUrl, idx) => (
        <div key={imageUrl} className="d-flex flex-column">
          <Image
            src={imageUrl}
            width={100}
            height={100}
            alt={`Image ${imageUrl}`}
            onClick={() => {
              setShowPreview(true);
              setActiveIndex(idx);
            }}
            className="img-preview"
          />

          {showPreview && (
            <ImageViewer
              src={imagesUrls}
              currentIndex={activeIndex}
              onClose={() => setShowPreview(false)}
              disableScroll={false}
              backgroundStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
              }}
              closeOnClickOutside
            />
          )}
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
