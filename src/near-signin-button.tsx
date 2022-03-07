import React, { FC } from "react";
import { WalletConnection } from "near-api-js";

import Button from "./button";
import config from "./config";
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
      wallet.requestSignIn(config.contractId, "Shroom Kingdom NEARchan NFT");
    }
  };
  return (
    <Button onClick={handleClick}>
      {account ? "Sign out" : "Sign in with NEAR"}
    </Button>
  );
};
export default NearSigninButton;
