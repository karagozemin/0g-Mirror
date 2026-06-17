import { createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { providers } from "ethers";
import galileoChain from "./chains";

const { chains, publicClient, webSocketPublicClient } = configureChains([galileoChain], [publicProvider()]);

// WalletConnect Project ID provided by the project owner
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "e40e7554a29d019bedaad883896164a4";

const { connectors } = getDefaultWallets({ appName: "0G Mirror", projectId: WALLETCONNECT_PROJECT_ID, chains });

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

export { chains };
