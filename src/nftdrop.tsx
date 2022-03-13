import React, { FC, useState } from "react";
import { WalletConnection } from "near-api-js";

import Check from "../public/check.svg";
import Error from "../public/error.svg";

import Claim, { ClaimCheck } from "./claim";
import DiscordAccount from "./discord-account";
import ExternalLink from "./external-link";
import NearAccount from "./near-account";
import TwitterAccount from "./twitter-account";
import config from "./config";
import { DiscordUser } from "./discord";
import { NearUser } from "./near";
import { TwitterUser } from "./twitter";

const Nftdrop: FC = () => {
  const [claimCheck, setClaimCheck] = useState<ClaimCheck | null>(null);
  const [nearAccount, setNearAccount] = useState<NearUser | null>(null);
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [discordAccount, setDiscordAccount] = useState<DiscordUser | null>(
    null
  );
  const [twitterAccount, setTwitterAccount] = useState<TwitterUser | null>(
    null
  );
  const [twitterError, setTwitterError] = useState<string | null>(null);

  const levelPercent = nearAccount
    ? (100 * nearAccount.creditToNextLevel) / nearAccount.requiredToNextLevel
    : 0;

  console.log(
    "created",
    nearAccount?.createdAt.valueOf(),
    config.dateThreshold.valueOf()
  );

  return (
    <div className="grid">
      <style jsx>{`
        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          width: 100%;
        }

        @media (max-width: 768px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }

          .card {
            padding: 1.2rem 0.6rem;
          }
        }

        @media (min-width: 769px) {
          .card {
            margin-left: 1rem;
            margin-right: 1rem;
            padding: 1.5rem;
          }
        }

        .card {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 1rem;
          margin-bottom: 1rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 2px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          background: rgba(0, 0, 0, 0.05);
        }

        .card-image {
          min-width: 36px;
          max-width: 36px;
          height: 36px;
          margin-right: 1rem;
        }

        .card-image > * {
          width: 100%;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          width: 100%;
        }

        .card-row {
          width: 100%;
          display: flex;
          margin: 0.4rem 0;
          align-items: center;
        }

        .card-header {
          margin-top: 0;
        }

        .card-section {
          width: 100%;
          color: black;
          display: flex;
          justify-content: center;
          border-top: 2px dashed black;
          border-bottom: 2px dashed black;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #004ea9;
          border-color: #0070f3;
        }

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
      `}</style>

      <div className="card">
        <h1 className="card-header">Claim your reward</h1>
        <div className="card-row">
          <div className="card-image">
            {claimCheck?.near ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            {nearAccount == null ? (
              <>You are not logged in with NEAR</>
            ) : !claimCheck?.near ? (
              <>
                You have not yet fulfilled all preconditions with your Near
                wallet
              </>
            ) : (
              <>You have fulfilled all preconditions with your Near wallet</>
            )}
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {claimCheck?.discord ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            {discordAccount == null ? (
              <>You are not logged in with Discord</>
            ) : !claimCheck?.discord ? (
              <>You have not yet fulfilled all preconditions for Discord</>
            ) : (
              <>You have fulfilled all preconditions for Discord</>
            )}
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {claimCheck?.twitter ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            {twitterAccount == null ? (
              <>You are not logged in with Twitter</>
            ) : !claimCheck?.twitter ? (
              <>You have not yet fulfilled all preconditions for Twitter</>
            ) : (
              <>You have fulfilled all preconditions for Twitter</>
            )}
          </div>
        </div>
        <div className="card-row">
          <div className="card-content">
            <Claim
              claimCheck={claimCheck}
              setClaimCheck={setClaimCheck}
              wallet={wallet}
              walletId={nearAccount?.walletId}
              discordOwnerId={discordAccount?.id}
              twitterOwnerId={twitterAccount?.screenName}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="card-header">Connect with Near Wallet</h1>
        <div className="card-row">
          <div className="card-image">
            {nearAccount ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <NearAccount
              account={nearAccount}
              setAccount={setNearAccount}
              wallet={wallet}
              setWallet={setWallet}
            />
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {(nearAccount?.createdAt.valueOf() || 0) <
            config.dateThreshold.valueOf() ? (
              <Check />
            ) : (
              <Error />
            )}
          </div>
          <div className="card-content">
            <h4>
              Account created before {config.dateThreshold.toLocaleString()}?
            </h4>
            {nearAccount && nearAccount?.createdAt.toLocaleString()}
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {nearAccount?.staked ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Has staked with a validator or via{" "}
              <ExternalLink href="https://metapool.app/dapp/mainnet/meta/">
                Metapool
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {(nearAccount?.level ?? 0) >= 3 ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Has reached level 3 on{" "}
              <ExternalLink
                href={
                  nearAccount
                    ? `https://stats.gallery/mainnet/${nearAccount.walletId}/overview`
                    : "https://stats.gallery"
                }
              >
                stats.gallery
              </ExternalLink>{" "}
              {nearAccount && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    height: "24px",
                    maxWidth: "100%",
                    borderRadius: "6px",
                    background: `linear-gradient(to right, #1678c2 ${levelPercent}%, #bbb ${levelPercent}%)`,
                    color: "black",
                  }}
                >
                  Level: {nearAccount.level} - {nearAccount.creditToNextLevel} /{" "}
                  {nearAccount?.requiredToNextLevel}
                </div>
              )}
            </h4>
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="card-header">Connect with Discord</h1>
        <div className="card-row">
          <div className="card-image">
            {discordAccount ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <DiscordAccount
              account={discordAccount}
              setAccount={setDiscordAccount}
            />
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {(discordAccount?.createdAt.valueOf() || 0) <
            config.dateThreshold.valueOf() ? (
              <Check />
            ) : (
              <Error />
            )}
          </div>
          <div className="card-content">
            <h4>
              Account created before {config.dateThreshold.toLocaleString()}?
            </h4>
            {discordAccount && discordAccount?.createdAt.toLocaleString()}
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {discordAccount?.isMember ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Has joined{" "}
              <ExternalLink href="https://discord.gg/DYpNr4cHxE">
                Shroom Kingdom Discord server
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {discordAccount?.verified ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>Has a verified Email</h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {discordAccount?.acceptedRules ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>Accepted rules of Shroom Kingdom Discord server</h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {discordAccount?.solvedCaptcha ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>Solved captcha on Shroom Kingdom Discord server</h4>
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="card-header">Connect with Twitter</h1>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            {twitterError ? (
              twitterError
            ) : (
              <TwitterAccount
                account={twitterAccount}
                setAccount={setTwitterAccount}
                setError={setTwitterError}
              />
            )}
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.isFollowing ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Is following{" "}
              <ExternalLink href="https://twitter.com/shrm_kingdom">
                Shroom Kingdom
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.verified ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>Has a verified Email</h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.retweeted ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Retweeted{" "}
              <ExternalLink
                href={`https://twitter.com/shrm_kingdom/status/${config.tweetId}`}
              >
                our Tweet
              </ExternalLink>{" "}
              with hashtags #NFT #PlayToEarn #BlockchainGaming #Airdrop
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.liked ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Liked{" "}
              <ExternalLink
                href={`https://twitter.com/shrm_kingdom/status/${config.tweetId}`}
              >
                our Tweet
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-section">
            <h3>Follow Near Gaming</h3>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.isFollowingHumanguild ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Is following{" "}
              <ExternalLink href="https://twitter.com/humanguild">
                Humanguild
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.isFollowingNEARGames ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Is following{" "}
              <ExternalLink href="https://twitter.com/NearGamesGuild">
                Near Games
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.isFollowingNEARProtocol ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Is following{" "}
              <ExternalLink href="https://twitter.com/NEARProtocol">
                NEAR Protocol
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-section">
            <h3>Follow Shroom Kingdom Partners</h3>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.isFollowingNNC ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Is following{" "}
              <ExternalLink href="https://twitter.com/NearNft">
                NEAR NFT Club
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.isFollowingFSC ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Is following{" "}
              <ExternalLink href="https://twitter.com/near_fsc">
                Friendlyseacreatures
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="card-row">
          <div className="card-image">
            {twitterAccount?.isFollowingASAC ? <Check /> : <Error />}
          </div>
          <div className="card-content">
            <h4>
              Is following{" "}
              <ExternalLink href="https://twitter.com/ASAC_NFT">
                Antisocial Ape Club
              </ExternalLink>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Nftdrop;
