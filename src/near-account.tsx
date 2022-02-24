import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { WalletConnection, connect, keyStores } from "near-api-js";

import NearSigninButton from "./near-signin-button";
import { NearUser } from "./near";

const NearAccount: FC<{
  account: NearUser | null;
  setAccount: Dispatch<SetStateAction<NearUser | null>>;
}> = ({ account, setAccount }) => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  useEffect(() => {
    const run = async () => {
      if (process.browser) {
        const config = {
          networkId: "testnet",
          keyStore: new keyStores.BrowserLocalStorageKeyStore(),
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
          headers: {},
        };

        const near = await connect(config);
        const wallet = new WalletConnection(near, null);
        setWallet(wallet);

        const walletId = wallet.getAccountId() as string | null;
        if (!walletId) {
          return;
        }

        const res = await fetch(
          `https://nftdrop.shrm.workers.dev/near/${walletId}`
        );
        if (!res.ok) {
          console.error(await res.text());
          return;
        }
        const user = await res.json();
        user.createdAt = new Date(user.createdAt);
        setAccount(user);
      }
    };
    run();
  }, [setAccount]);
  const signOut = () => {
    if (!wallet) return;
    wallet.signOut();
    setAccount(null);
  };
  return (
    <>
      {account && <div>{account.walletId}</div>}
      {wallet && (
        <NearSigninButton account={account} wallet={wallet} signOut={signOut} />
      )}
    </>
  );
};
export default NearAccount;
