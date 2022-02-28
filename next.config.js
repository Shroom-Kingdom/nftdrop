/* eslint-disable @typescript-eslint/no-var-requires */
const Dotenv = require("dotenv-webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  pageExtensions: ["md", "mdx", "tsx", "ts", "jsx", "js"],

  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          /** @type {import('@mdx-js/loader').Options} */
          options: {},
        },
      ],
    });
    config.plugins.push(
      new Dotenv({
        path: process.env.NODE_ENV === "production" ? "./.env-prod" : "./.env",
      })
    );

    return config;
  },
};
