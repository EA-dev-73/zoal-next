import Image from "next/image";
import { useState } from "react";
import { ProductTypeImage, ProductType } from "../../types";

type Props = {
  // client-side save => string (devex); from server => string[]
  imagesUrl: ProductTypeImage["imageUrl"][] | string;
};

export const DisplayProductTypeImages = ({ imagesUrl }: Props) => {
  const [displayImages, setDisplayImages] = useState(false);
  const images =
    typeof imagesUrl === "object" ? imagesUrl : imagesUrl.split(",");
  if (!images?.length) return null;
  return (
    <>
      <button onClick={() => setDisplayImages(!displayImages)}>
        {images.length > 1
          ? `Afficher les ${images.length} images`
          : "Afficher l'image"}
      </button>
      {displayImages && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {images.map((image) => (
            <div key={image} style={{ margin: "10px" }}>
              <Image alt={image} src={image} width={500} height={500} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
