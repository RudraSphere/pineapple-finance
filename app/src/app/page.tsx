import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <ConnectButton
      showBalance={{
        smallScreen: false,
        largeScreen: true,
      }}
    />
  );
}
