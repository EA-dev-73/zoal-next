import Image from "next/image";
import { ProductType as ProductType, Product } from "../types";
import styles from "../styles/ProductCard.module.css";
import Link from "next/link";

type Props = {
  productType: ProductType;
};

export const ProductCard = ({ productType }: Props) => {
  const image = productType.productTypeImage[0];
  const placeholderImage = "/images/nav-logo.jpg";

  return (
    <Link href={`/article/${productType.id}`} passHref>
      <div className={styles["product-card"]}>
        <Image
          src={image?.imageBucketKey || placeholderImage}
          alt="image du produit"
          className={styles.image}
          width={300}
          height={200}
        />
        <p className={styles.imageText}>{productType.name}</p>
      </div>
    </Link>
  );
};
