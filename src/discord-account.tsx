import React, { Dispatch, FC, SetStateAction, useEffect } from "react";

import DiscordSigninButton from "./discord-signin-button";
import { DiscordUser } from "./discord";
import { removeQueryParams } from "./helper";
import {
  DiscordSession,
  SessionHeader,
  SessionStorageKey,
  getDiscordSessionHeader,
} from "./session";

const DiscordAccount: FC<{
  account: DiscordUser | null;
  setAccount: Dispatch<SetStateAction<DiscordUser | null>>;
}> = ({ account, setAccount }) => {
  useEffect(() => {
    const run = async () => {
      if (process.browser) {
        const discordSession = window.localStorage.getItem(
          SessionStorageKey.Discord
        );
        if (window.location.search.startsWith("?")) {
          const queryParams = new URLSearchParams(
            window.location.search.substr(1)
          );
          const state = window.localStorage.getItem("DISCORD_STATE");
          const code = queryParams.get("code");
          if (code && state === queryParams.get("state")) {
            const res = await fetch(
              `https://nftdrop.shrm.workers.dev/discord/token`,
              {
                method: "POST",
                body: JSON.stringify({ code }),
              }
            );
            removeQueryParams();
            if (!res.ok) {
              console.error(await res.text());
              return;
            }
            const user = await res.json();
            const session = getDiscordSessionHeader(res);
            if (!session) return;
            signIn(user, session);
            return;
          }
        }
        if (discordSession) {
          const res = await fetch(
            `https://nftdrop.shrm.workers.dev/discord/refresh`,
            {
              method: "POST",
              headers: {
                [SessionHeader.Discord]: discordSession,
              },
            }
          );
          if (!res.ok) {
            signOut();
            console.error(await res.text());
            return;
          }
          const user = await res.json();
          const session = getDiscordSessionHeader(res);
          if (!session) return;
          signIn(user, session);
        }
      }
    };
    const signIn = (user: DiscordUser, session: DiscordSession) => {
      window.localStorage.setItem(
        SessionStorageKey.Discord,
        encodeURIComponent(JSON.stringify(session))
      );
      user.createdAt = new Date(user.createdAt);
      setAccount(user);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const signOut = () => {
    window.localStorage.removeItem(SessionStorageKey.Discord);
    setAccount(null);
  };
  return (
    <>
      {account && (
        <div>
          {account.username}#{account.discriminator}
        </div>
      )}
      <DiscordSigninButton account={account} signOut={signOut} />
    </>
  );
};
export default DiscordAccount;
