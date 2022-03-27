import Image from "next/image";
import { ProductType } from "../../types";

type Props = {
  images: ProductType["productTypeImage"];
};

export const DisplayProductTypeImages = ({ images }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      {images.map((image) => (
        <Image
          key={image.id}
          alt={`/images/${image.imageName}`}
          src={`/images/${image.imageName}`}
          width={500}
          height={500}
        />
      ))}
    </div>
  );
};
