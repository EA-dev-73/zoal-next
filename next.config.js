/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "placeimg.com",
      "drive.google.com",
      "doc-0o-b8-docs.googleusercontent.com",
      "cdn.pixabay.com",
      "media.istockphoto.com",
      "i.redd.it",
      "image.shutterstock.com",
      "i.etsystatic.com",
    ],
  },
};

module.exports = nextConfig;
