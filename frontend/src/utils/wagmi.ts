import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Jumper challenge",
  projectId: "97e0a3dffed4e1798738cc5c78c99024",
  chains: [mainnet],
  ssr: true,
});
