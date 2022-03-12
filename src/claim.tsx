import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Contract, WalletConnection } from "near-api-js";

import Button from "./button";
import ExternalLink from "./external-link";
import Nft from "./nft";
import config from "./config";
import { useDebounceCallback } from "./helper";
import { SessionHeader, SessionStorageKey } from "./session";

export interface ClaimCheck {
  near: boolean;
  discord: boolean;
  twitter: boolean;
  tokenId?: string;
  approvalId?: number;
  imgSrc?: string;
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
  scannedAllNfts: boolean;
}

const Claim: FC<{
  claimCheck: ClaimCheck | null;
  setClaimCheck: Dispatch<SetStateAction<ClaimCheck | null>>;
  wallet: WalletConnection | null;
  walletId?: string;
  discordOwnerId?: string;
  twitterOwnerId?: string;
}> = ({
  claimCheck,
  setClaimCheck,
  wallet,
  walletId,
  discordOwnerId,
  twitterOwnerId,
}) => {
  const [availableNfts, setAvailableNfts] = useState<AvailableNfts | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const fetchCheck = useDebounceCallback(
    async () => {
      const res = await fetch(`${config.baseApiUrl}/nftdrop/check`, {
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
    },
    1000,
    [setClaimCheck, walletId, discordOwnerId, twitterOwnerId]
  );

  const infoCheck = useCallback(async () => {
    const res = await fetch(`${config.baseApiUrl}/nftdrop/info`);
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
    claimCheck.tokenId == null &&
    claimCheck.approvalId == null
  );

  const transferNFT = useCallback(
    (tokenId: string, approvalId: number) => async () => {
      try {
        setLoading(true);
        if (!wallet || !walletId) return;
        const contract = new Contract(wallet.account(), config.contractId, {
          viewMethods: [],
          changeMethods: ["nft_transfer"],
        });
        // FIXME typings
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (contract as any).nft_transfer({
          args: {
            receiver_id: walletId,
            token_id: tokenId,
            approval_id: approvalId,
          },
          amount: "1",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [wallet, walletId]
  );

  const claim = useCallback(
    (nft: NftType) => async () => {
      try {
        setLoading(true);
        const twitterSession = window.localStorage.getItem(
          SessionStorageKey.Twitter
        );
        const discordSession = window.localStorage.getItem(
          SessionStorageKey.Discord
        );
        if (!twitterSession || !discordSession || !canClaim) return;
        const res = await fetch(`${config.baseApiUrl}/nftdrop/claim`, {
          method: "POST",
          body: JSON.stringify({ walletId, nft }),
          headers: {
            [SessionHeader.Discord]: discordSession,
            [SessionHeader.Twitter]: twitterSession,
          },
        });
        if (!res.ok) {
          console.error(res.status, await res.text());
          return;
        }

        const {
          tokenId,
          approvalId,
          imgSrc,
        }: { tokenId: string; approvalId: number; imgSrc: string } =
          await res.json();

        await transferNFT(tokenId, approvalId)();

        setClaimCheck({ ...claimCheck, tokenId, approvalId, imgSrc });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [canClaim, walletId, transferNFT, setClaimCheck, claimCheck]
  );

  useEffect(() => {
    fetchCheck();
  }, [fetchCheck]);
  useEffect(() => {
    infoCheck();
    const poll = () => {
      setTimeout(async () => {
        await infoCheck();
        poll();
      }, 10000);
    };
    poll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tokenId = claimCheck?.tokenId;
  const approvalId = claimCheck?.approvalId;

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
        {tokenId != null ? (
          <>
            <div className="nft-wrapper">
              <Nft
                imgSrc={claimCheck?.imgSrc ?? ""}
                alt="near-chan-smw-big"
                loading={loading}
              >
                <div>You claimed NFT with ID {tokenId}</div>
                {approvalId != null && (
                  <>
                    <b>You have not yet transferred it to your wallet!</b>
                    <Button
                      onClick={transferNFT(tokenId, approvalId)}
                      loading={loading}
                    >
                      Transfer
                    </Button>
                  </>
                )}
                <div>
                  The collection is also listed on{" "}
                  <ExternalLink href="https://paras.id/collection/near-chan.shrm.near">
                    Paras
                  </ExternalLink>{" "}
                  where you can trade it.
                </div>
              </Nft>
            </div>
          </>
        ) : (
          <>
            <div>You can only claim one NFT! Choose wisely</div>
            {availableNfts && (
              <div className="nft-wrapper">
                <Nft
                  imgSrc="/near-chan-smw-big.png"
                  alt="near-chan-smw-big"
                  claimOptions={{
                    claim: claim(NftType.SmwBig),
                    canClaim,
                    unclaimed: availableNfts[NftType.SmwBig],
                    scannedAllNfts: availableNfts.scannedAllNfts,
                  }}
                  loading={loading}
                />
                <Nft
                  imgSrc="/near-chan-smw-small.png"
                  alt="near-chan-smw-small"
                  claimOptions={{
                    claim: claim(NftType.SmwSmall),
                    canClaim,
                    unclaimed: availableNfts[NftType.SmwSmall],
                    scannedAllNfts: availableNfts.scannedAllNfts,
                  }}
                  loading={loading}
                />
                <Nft
                  imgSrc="/near-chan-smb3-big.png"
                  alt="near-chan-smb3-big"
                  claimOptions={{
                    claim: claim(NftType.Smb3Big),
                    canClaim,
                    unclaimed: availableNfts[NftType.Smb3Big],
                    scannedAllNfts: availableNfts.scannedAllNfts,
                  }}
                  loading={loading}
                />
                <Nft
                  imgSrc="/near-chan-smb3-small.png"
                  alt="near-chan-smb3-small"
                  claimOptions={{
                    claim: claim(NftType.Smb3Small),
                    canClaim,
                    unclaimed: availableNfts[NftType.Smb3Small],
                    scannedAllNfts: availableNfts.scannedAllNfts,
                  }}
                  loading={loading}
                />
                <Nft
                  imgSrc="/near-chan-smb1-big.png"
                  alt="near-chan-smb1-big"
                  claimOptions={{
                    claim: claim(NftType.Smb1Big),
                    canClaim,
                    unclaimed: availableNfts[NftType.Smb1Big],
                    scannedAllNfts: availableNfts.scannedAllNfts,
                  }}
                  loading={loading}
                />
                <Nft
                  imgSrc="/near-chan-smb1-small.png"
                  alt="near-chan-smb1-small"
                  claimOptions={{
                    claim: claim(NftType.Smb1Small),
                    canClaim,
                    unclaimed: availableNfts[NftType.Smb1Small],
                    scannedAllNfts: availableNfts.scannedAllNfts,
                  }}
                  loading={loading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default Claim;
