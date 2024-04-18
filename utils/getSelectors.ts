import { Contract } from "ethers";

export function getSelectors(contract: Contract) {
  const selectors = Object.keys(contract.interface.functions)
    .filter((fnName) => fnName !== "init(bytes)")
    .map((fnName) => contract.interface.getSighash(fnName));
  return selectors;
}
