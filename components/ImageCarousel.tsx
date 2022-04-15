import { ProductTypeImage } from "../types";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

type Props = {
  images: ProductTypeImage[];
};

export const ImageCarousel = ({ images }: Props) => {
  return (
    <div>
      <Carousel showArrows>
        {images.map((image, idx) => (
          <div key={image.id}>
            <Image
              src={image.imageBucketKey}
              alt={image.imageBucketKey}
              width={300}
              height={300}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
