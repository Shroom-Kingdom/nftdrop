import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";

import Nft from "./nft";

export interface ClaimCheck {
  discord: boolean;
  twitter: boolean;
  tokenId?: string;
}

const Claim: FC<{
  claimCheck: ClaimCheck | null;
  setClaimCheck: Dispatch<SetStateAction<ClaimCheck | null>>;
  nearAccount: string | null;
  discordOwnerId?: string;
  twitterOwnerId?: string;
}> = ({
  claimCheck,
  setClaimCheck,
  nearAccount,
  discordOwnerId,
  twitterOwnerId,
}) => {
  const fetchCheck = useCallback(async () => {
    const res = await fetch("https://nftdrop.shrm.workers.dev/nftdrop/check", {
      method: "POST",
      body: JSON.stringify({
        discordOwnerId,
        twitterOwnerId,
      }),
    });
    if (!res.ok) {
      console.error(res.status, await res.text());
      return;
    }
    setClaimCheck(await res.json());
  }, [setClaimCheck, discordOwnerId, twitterOwnerId]);

  const canClaim = !!(
    claimCheck &&
    claimCheck.discord &&
    claimCheck.twitter &&
    !claimCheck.tokenId &&
    nearAccount != null
  );
  const claim = useCallback(
    (nft: string) => async () => {
      if (!discordOwnerId || !twitterOwnerId || !canClaim) return;
      const res = await fetch(
        "https://nftdrop.shrm.workers.dev/nftdrop/claim",
        {
          method: "POST",
          body: JSON.stringify({ discordOwnerId, twitterOwnerId, nft }),
        }
      );
      if (!res.ok) {
        console.error(res.status, await res.text());
        return;
      }
      const tokenId = await res.text();
      setClaimCheck({ ...claimCheck, tokenId });
    },
    [discordOwnerId, twitterOwnerId, claimCheck, canClaim, setClaimCheck]
  );

  useEffect(() => {
    fetchCheck();
  }, [fetchCheck]);

  const tokenId = claimCheck?.tokenId;

  return (
    <>
      <style jsx>{`
        .wrapper {
          display: flex:
          flex-direction: column;
          width: 100%;
          justify-content: center;
          margin-top: 1rem;
        }

        .link-wrapper {
          max-width: 100%;
          word-wrap: break-word;
        }

        .link {
          font-family: monospace;
        }

        .nft-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
        }
      `}</style>
      <div className="wrapper">
        <div>
          {tokenId
            ? "You claimed NFT with ID " + tokenId
            : "You can only claim one NFT! Choose wisely"}
        </div>
        <div className="nft-wrapper">
          <Nft
            imgSrc="/near-chan-smw-big.png"
            alt="near-chan-smw-big"
            claim={claim("smw-big")}
            canClaim={canClaim}
          />
          <Nft
            imgSrc="/near-chan-smw-small.png"
            alt="near-chan-smw-small"
            claim={claim("smw-small")}
            canClaim={canClaim}
          />
          <Nft
            imgSrc="/near-chan-smb3-big.png"
            alt="near-chan-smb3-big"
            claim={claim("smb3-big")}
            canClaim={canClaim}
          />
          <Nft
            imgSrc="/near-chan-smb3-small.png"
            alt="near-chan-smb3-small"
            claim={claim("smb3-small")}
            canClaim={canClaim}
          />
          <Nft
            imgSrc="/near-chan-smb1-big.png"
            alt="near-chan-smb1-big"
            claim={claim("smb1-big")}
            canClaim={canClaim}
          />
          <Nft
            imgSrc="/near-chan-smb1-small.png"
            alt="near-chan-smb1-small"
            claim={claim("smb1-small")}
            canClaim={canClaim}
          />
        </div>
      </div>
    </>
  );
};
export default Claim;
