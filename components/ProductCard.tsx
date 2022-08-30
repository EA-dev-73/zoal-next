import Image from "next/image";
import { ProductTypeWithImages } from "../types";
import styles from "../styles/ProductCard.module.css";
import Link from "next/link";

type Props = {
  productType: ProductTypeWithImages;
};

export const ProductCard = ({ productType }: Props) => {
  const image = productType?.imagesUrls?.[0];
  const placeholderImage = "/images/nav-logo.jpg";

  return (
    <Link href={`/article/${productType.id}`} passHref>
      <div className={styles["product-card"]}>
        <Image
          src={image || placeholderImage}
          alt="image du produit"
          className={styles.image}
          width={300}
          height={300}
        />
        <p className={styles.imageText}>{productType.name}</p>
      </div>
    </Link>
  );
};
