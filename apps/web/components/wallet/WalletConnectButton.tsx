"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

export function WalletConnectButton() {
  return <ConnectButton showBalance={false} />;
}

export default WalletConnectButton;
