import Image from "next/image";
import { ProductImage, ProductType } from "../../types";

type Props = {
  // client-side save => string (devex); from server => string[]
  imagesUrl: ProductImage["imageUrl"][] | string;
};

export const DisplayProductTypeImages = ({ imagesUrl }: Props) => {
  const images =
    typeof imagesUrl === "object" ? imagesUrl : imagesUrl.split(",");
  if (!images) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      {images.map((image) => (
        <Image key={image} alt={image} src={image} width={500} height={500} />
      ))}
    </div>
  );
};
