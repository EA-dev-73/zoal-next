import Image from "next/image";
import React, { useState } from "react";
import styles from "../styles/ArticlePage.module.css";
import ImageViewer from "react-simple-image-viewer";

type Props = {
  imagesUrls: string[];
};

export const DisplayArticlePageImages = ({ imagesUrls }: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="d-flex flex-column">
        {imagesUrls.map((image, idx) => (
          <div key={image} className={styles["images-container"]}>
            <Image
              src={image}
              alt="image du produit"
              width="100%"
              height="100%"
              layout="responsive"
              objectFit="contain"
              onClick={() => {
                setShowPreview(true);
                setActiveIndex(idx);
              }}
            />
          </div>
        ))}
      </div>
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
    </>
  );
};
