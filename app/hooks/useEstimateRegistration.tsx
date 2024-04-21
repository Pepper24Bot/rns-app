import { Address, encodeFunctionData } from "viem";
import { useEstimateGas, useGasPrice } from "wagmi";

export interface EstimateRegistration {
  owner: Address | undefined;
  encodedFunction: `0x${string}`;
}

/** TODO: Optimize this hook */
export default function useEstimateRegistration(props: EstimateRegistration) {
  const {
    owner = "0x8F8faa9eBB54DEda91a62B4FC33550B19B9d33bf", // personal-account - dummy
    encodedFunction,
  } = props;

  const { data: estimatedGas } = useEstimateGas({
    account: owner,
    to: owner,
    data: encodedFunction, // contract address or contract hashed method
  });

  const { data: gasPrice } = useGasPrice();

  return {
    estimatedGas: estimatedGas || BigInt(0),
    gasPrice: gasPrice || BigInt(0),
  };
}
