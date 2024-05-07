import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, encodeFunctionData } from "viem";
import { Payment } from "@/redux/domain/domainSlice";
import { estimateGas, getFeeHistory } from "@wagmi/core";
import { config } from "@/chains/config";
import { createExtrinsicPayload } from "@/utils/futurepass";

import useConnectRoot from "../useConnectRoot";
import useContractDetails from "../useContractDetails";
import Keyring from "@polkadot/keyring";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export interface RegisterProps {
  nameHash?: Address;
  args?: {
    name: string;
    owner?: Address;
    duration: number;
    secret: string;
    resolverAddr: Address;
    payment?: Payment;
    futurePassAddress?: string;
    addressRecord?: string;
  };
}

export default function useFpRegister() {
  const { getApiPromise } = useConnectRoot();
  const { address: walletAddress } = useAccount();

  const controller = useContractDetails({ action: "RegistrarController" });

  const makeCommitment = async (props: RegisterProps) => {
    const { nameHash, args } = props;

    const api = await getApiPromise("porcini");
    const fpAccount = args?.futurePassAddress;

    if (nameHash && args && fpAccount) {
      // Get transaction data using encodeFunctionData
      const data = encodeFunctionData({
        abi: controller.abi,
        functionName: "makeCommitment",
        args: [
          args.name,
          fpAccount,
          args.duration,
          args.secret,
          args.resolverAddr,
          [args.addressRecord],
          false,
          0,
        ],
      });

      // Estimate Contract Gas
      const estimatedGas = await estimateGas(config, {
        account: walletAddress,
        to: controller.address,
        data,
      });
      const gasLimit = Number(estimatedGas);

      // Get Fee History
      const feeHistory = await getFeeHistory(config, {
        blockCount: 2,
        rewardPercentiles: [25, 75],
      });
      const maxFee = feeHistory.baseFeePerGas[0] || BigInt(7500000000000);
      const maxFeePerGas = Number(maxFee);

      // Prepare Transaction Call
      const evmCall = api.tx.evm.call(
        fpAccount,
        controller.address,
        data,
        0,
        gasLimit,
        maxFeePerGas,
        0,
        null,
        []
      );

      // Call ProxyExtrinsic
      const extrinsic = api.tx.futurepass.proxyExtrinsic(
        fpAccount ?? "",
        evmCall
      );

      // Create Extrinsic Payload and Sign it using the wallet/eoa address
      const { payload, ethPayload } = await createExtrinsicPayload({
        api,
        address: walletAddress ?? "",
        extrinsic,
      });

      // Get the user to sign the message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [ethPayload, walletAddress],
      });

      // Add the signature to the extrinsic
      const signedExtrinsic = extrinsic.addSignature(
        walletAddress ?? "",
        signature as `0x${string}`,
        payload.toPayload()
      );

      // Submit the transaction
      const result = await api.tx(signedExtrinsic).send();
      return result.toHex();
    }
  };

  const register = async () => {};

  return {
    registerUsingFp: register,
    makeFpCommitment: makeCommitment,
  };
}
