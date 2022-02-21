import React, { FC } from "react";
import { WalletConnection } from "near-api-js";

import Button from "./button";
import { NearUser } from "./near";

const NearSigninButton: FC<{
  account: NearUser | null;
  wallet: WalletConnection;
  signOut: () => void;
}> = ({ account, wallet, signOut }) => {
  const handleClick = async () => {
    if (account) {
      signOut();
    } else {
      wallet.requestSignIn(
        "near-chan-v5.shrm.testnet",
        "Shroom Kingdom NEARchan NFT"
      );
    }
  };
  return (
    <Button onClick={handleClick}>
      {account ? "Sign out" : "Sign in with NEAR"}
    </Button>
  );
};
export default NearSigninButton;
