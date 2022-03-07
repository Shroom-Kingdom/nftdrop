// import Image from "next/image";
import React, { FC, MouseEventHandler } from "react";

import Button from "./button";

const Nft: FC<{
  imgSrc: string;
  alt: string;
  claimOptions?: {
    claim: MouseEventHandler<HTMLButtonElement>;
    canClaim: boolean;
    unclaimed: number;
  };
  loading?: boolean;
}> = ({ imgSrc, alt, claimOptions, loading, children }) => (
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
      {claimOptions && (
        <>
          <div style={{ margin: "0.5rem 0" }}>
            Remaining: {claimOptions.unclaimed}
          </div>
          <Button
            disabled={!claimOptions.canClaim || claimOptions.unclaimed === 0}
            onClick={claimOptions.claim}
            loading={loading}
          >
            {claimOptions.unclaimed ?? 0 > 0 ? "Claim now" : "All claimed"}
          </Button>
        </>
      )}
      {children && (
        <div
          style={{
            margin: "0.5rem 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  </>
);
export default Nft;
