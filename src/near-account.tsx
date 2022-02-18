import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { WalletConnection, connect, keyStores } from "near-api-js";

import NearSigninButton from "./near-signin-button";

const NearAccount: FC<{
  account: string | null;
  setAccount: Dispatch<SetStateAction<string | null>>;
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

        const accountId = wallet.getAccountId();
        if (accountId) {
          setAccount(accountId);
        }
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
      {account && <div>{account}</div>}
      {wallet && (
        <NearSigninButton account={account} wallet={wallet} signOut={signOut} />
      )}
    </>
  );
};
export default NearAccount;
