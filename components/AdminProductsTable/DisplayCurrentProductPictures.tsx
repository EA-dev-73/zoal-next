import Image from "next/image";
import React from "react";
import { ProductTypeWithImages } from "../../types";

type Props = {
  imagesUrls: ProductTypeWithImages["imagesUrls"];
  isEdit?: boolean;
};

export const DisplayCurrentProductImages = ({
  imagesUrls = [],
  isEdit = true,
}: Props) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {imagesUrls.map((image) => (
        <div key={image} style={{ display: "flex", flexDirection: "column" }}>
          <Image src={image} width={100} height={100} alt={`Image ${image}`} />
          {isEdit && (
            <button
              role="button"
              className="btn btn-outline-danger my-3 "
              onClick={() => {}}
            >
              Supprimer
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
