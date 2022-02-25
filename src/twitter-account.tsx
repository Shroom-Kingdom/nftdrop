import React, { Dispatch, FC, SetStateAction, useEffect } from "react";

import TwitterSigninButton from "./twitter-signin-button";
import { removeQueryParams } from "./helper";
import { TwitterUser } from "./twitter";
import {
  SessionHeader,
  SessionStorageKey,
  getTwitterSessionHeader,
} from "./session";

const TwitterAccount: FC<{
  account: TwitterUser | null;
  setAccount: Dispatch<SetStateAction<TwitterUser | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
}> = ({ account, setAccount, setError }) => {
  useEffect(() => {
    const run = async () => {
      if (process.browser) {
        const twitterSession = window.localStorage.getItem(
          SessionStorageKey.Twitter
        );
        if (window.location.search.startsWith("?")) {
          const queryParams = new URLSearchParams(
            window.location.search.substr(1)
          );
          const oauthToken = queryParams.get("oauth_token");
          const oauthVerifier = queryParams.get("oauth_verifier");
          if (oauthToken && oauthVerifier) {
            const res = await fetch(
              `https://nftdrop.shrm.workers.dev/twitter/access-token`,
              {
                method: "POST",
                body: JSON.stringify({ oauthToken, oauthVerifier }),
              }
            );
            removeQueryParams();
            if (!res.ok) {
              signOut();
              console.error(await res.text());
              return;
            }
            const user: TwitterUser = await res.json();
            setAccount(user);
            const session = getTwitterSessionHeader(res);
            if (!session) return;
            window.localStorage.setItem(
              SessionStorageKey.Twitter,
              encodeURIComponent(JSON.stringify(session))
            );
            return;
          }
        }
        if (twitterSession) {
          const res = await fetch(
            `https://nftdrop.shrm.workers.dev/twitter/verify`,
            {
              method: "POST",
              headers: {
                [SessionHeader.Twitter]: twitterSession,
              },
            }
          );
          removeQueryParams();
          if (!res.ok) {
            signOut();
            if (res.status === 429) {
              setError(
                "You just got rate limited by Twitter API. Please wait a few minutes and then try again (refresh this page)."
              );
            }
            console.error(await res.text());
            return;
          }
          const user: TwitterUser = await res.json();
          setAccount(user);
        }
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const signOut = () => {
    window.localStorage.removeItem(SessionStorageKey.Twitter);
    setAccount(null);
  };
  return (
    <>
      {account && (
        <div>
          {account.name} (@{account.screenName})
        </div>
      )}
      <TwitterSigninButton account={account} signOut={signOut} />
    </>
  );
};
export default TwitterAccount;
