import { config } from "@/chains/config";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Address } from "viem";

/** TODO: Optimize this hook */
export default function useWaitTransaction() {
  const waitForWriteTransaction = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(config, {
      hash,
    });

    return {
      isSuccess: true,
      error: null,
      data: {
        hash,
        receipt,
      },
    };
  };

  const waitForReadTransaction = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(config, {
      hash,
    });

    return {
      isSuccess: true,
      error: null,
      data: {
        hash,
        receipt,
      },
    };
  };

  return {
    waitForWriteTransaction,
    waitForReadTransaction,
  };
}
