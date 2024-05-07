import { config } from "@/chains/config";
import { estimateGas, getFeeHistory } from "@wagmi/core";
import { Address } from "viem";

export interface EstimateProps {
  account: Address;
  contractAddr: Address;

  /** EncodeFunctionData */
  data: `0x${string}`;
}

/** TODO: Optimize this hook */
export default function useEstimateFees() {
  const getEstimatedGas = async (props: EstimateProps) => {
    const {
      account, // personal-account - dummy
      contractAddr,
      data,
    } = props;

    const estimatedGas = await estimateGas(config, {
      account,
      to: contractAddr,
      data,
    });

    return Number(estimatedGas);
  };

  const getMaxFeePerGas = async () => {
    const feeHistory = await getFeeHistory(config, {
      blockCount: 2,
      rewardPercentiles: [25, 75],
    });
    const maxFee = feeHistory.baseFeePerGas[0] || BigInt(7500000000000);
    return Number(maxFee);
  };

  return { getEstimatedGas, getMaxFeePerGas };
}
