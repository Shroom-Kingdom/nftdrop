import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import Nft from "./nft";

export interface ClaimCheck {
  near: boolean;
  discord: boolean;
  twitter: boolean;
  tokenId?: string;
}

enum NftType {
  Smb1Small = "smb1-small",
  Smb1Big = "smb1-big",
  Smb3Small = "smb3-small",
  Smb3Big = "smb3-big",
  SmwSmall = "smw-small",
  SmwBig = "smw-big",
}

interface AvailableNfts {
  [NftType.Smb1Small]: number;
  [NftType.Smb1Big]: number;
  [NftType.Smb3Small]: number;
  [NftType.Smb3Big]: number;
  [NftType.SmwSmall]: number;
  [NftType.SmwBig]: number;
}

const Claim: FC<{
  claimCheck: ClaimCheck | null;
  setClaimCheck: Dispatch<SetStateAction<ClaimCheck | null>>;
  walletId?: string;
  discordOwnerId?: string;
  twitterOwnerId?: string;
}> = ({
  claimCheck,
  setClaimCheck,
  walletId,
  discordOwnerId,
  twitterOwnerId,
}) => {
  const [availableNfts, setAvailableNfts] = useState<AvailableNfts | null>(
    null
  );

  const fetchCheck = useCallback(async () => {
    const res = await fetch("https://nftdrop.shrm.workers.dev/nftdrop/check", {
      method: "POST",
      body: JSON.stringify({
        walletId,
        discordOwnerId,
        twitterOwnerId,
      }),
    });
    if (!res.ok) {
      console.error(res.status, await res.text());
      return;
    }
    setClaimCheck(await res.json());
  }, [setClaimCheck, walletId, discordOwnerId, twitterOwnerId]);

  const infoCheck = useCallback(async () => {
    const res = await fetch("https://nftdrop.shrm.workers.dev/nftdrop/info");
    if (!res.ok) {
      console.error(res.status, await res.text());
      return;
    }
    setAvailableNfts(await res.json());
  }, [setAvailableNfts]);

  const canClaim = !!(
    claimCheck &&
    claimCheck.near &&
    claimCheck.discord &&
    claimCheck.twitter &&
    !claimCheck.tokenId
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
  useEffect(() => {
    infoCheck();
  }, [infoCheck]);

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
        {availableNfts && (
          <div className="nft-wrapper">
            <Nft
              imgSrc="/near-chan-smw-big.png"
              alt="near-chan-smw-big"
              claim={claim("smw-big")}
              canClaim={canClaim}
              unclaimed={availableNfts[NftType.SmwBig]}
            />
            <Nft
              imgSrc="/near-chan-smw-small.png"
              alt="near-chan-smw-small"
              claim={claim("smw-small")}
              canClaim={canClaim}
              unclaimed={availableNfts[NftType.SmwSmall]}
            />
            <Nft
              imgSrc="/near-chan-smb3-big.png"
              alt="near-chan-smb3-big"
              claim={claim("smb3-big")}
              canClaim={canClaim}
              unclaimed={availableNfts[NftType.Smb3Big]}
            />
            <Nft
              imgSrc="/near-chan-smb3-small.png"
              alt="near-chan-smb3-small"
              claim={claim("smb3-small")}
              canClaim={canClaim}
              unclaimed={availableNfts[NftType.Smb3Small]}
            />
            <Nft
              imgSrc="/near-chan-smb1-big.png"
              alt="near-chan-smb1-big"
              claim={claim("smb1-big")}
              canClaim={canClaim}
              unclaimed={availableNfts[NftType.Smb1Big]}
            />
            <Nft
              imgSrc="/near-chan-smb1-small.png"
              alt="near-chan-smb1-small"
              claim={claim("smb1-small")}
              canClaim={canClaim}
              unclaimed={availableNfts[NftType.Smb1Small]}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default Claim;
