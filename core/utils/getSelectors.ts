import { ethers } from "ethers";

type CompatibleContract = {
  interface: ethers.utils.Interface;
};

export function getSelectors(contract: CompatibleContract): string[] {
  return Object.keys(contract.interface.functions).map((signature) =>
    contract.interface.getSighash(signature),
  );
}
