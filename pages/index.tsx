import Head from "next/head";
import React from "react";
import type { NextPage } from "next";

import Description from "../src/description.mdx";
import Faq from "../src/faq.mdx";
import Nftdrop from "../src/nftdrop";

const Home: NextPage = () => {
  return (
    <>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        a {
          text-decoration: none;
        }

        * {
          box-sizing: border-box;
        }

        .text-block ul {
          margin-top: 3rem;
        }
      `}</style>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .main {
          max-width: 100%;
          padding: 5rem 0;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          margin-bottom: 2rem;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .text-block {
          line-height: 1.5;
          font-size: 1.3rem;
          margin: 0 2rem;
          max-width: 60rem;
          text-align: left;
        }

        @media (max-width: 768px) {
          .text-block {
            line-height: 1.5;
            font-size: 1.3rem;
            margin: 0 0.6rem;
            max-width: 60rem;
            text-align: left;
          }
        }
      `}</style>

      <div className="container">
        <Head>
          <title>Shroom Kingdom NFT Airdrop</title>
          <meta
            name="description"
            content="Shroom Kingdom NFT Airdrop campaign. Get your free NFT by following our socials."
          />
          <link rel="icon" href="/favicon.ico" />
          <script
            defer
            data-domain="nftdrop.shroomkingdom.net"
            src="https://plausible.io/js/plausible.js"
          ></script>
        </Head>

        <main className="main">
          <h1 className="title">Shroom Kingdom NFT Airdrop</h1>

          <div className="text-block">
            <Description />
          </div>

          <Nftdrop />

          <div className="text-block">
            <Faq />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
