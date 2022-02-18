// import Image from "next/image";
import React, { FC, MouseEventHandler } from "react";

import Button from "./button";

const Nft: FC<{
  imgSrc: string;
  alt: string;
  claim: MouseEventHandler<HTMLButtonElement>;
  canClaim: boolean;
}> = ({ imgSrc, alt, claim, canClaim }) => (
  <>
    <style jsx>{`
      .nft-select {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0.8rem;
        padding: 0.8rem;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.2);
      }
    `}</style>
    <div className="nft-select">
      <img src={imgSrc} width={180} height={240} alt={alt} />
      <div style={{ marginTop: "1rem" }} />
      <Button disabled={!canClaim} onClick={claim}>
        Claim now
      </Button>
    </div>
  </>
);
export default Nft;
