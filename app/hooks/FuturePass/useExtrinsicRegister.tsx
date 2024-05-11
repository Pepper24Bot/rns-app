import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, encodeFunctionData } from "viem";
import { signExtrinsicPayload } from "@/utils/futurepass";
import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";
import {
  CommitProps,
  RegisterProps,
} from "@/interfaces/futurepass/registration";

import useContractDetails from "../useContractDetails";
import useEstimateFees from "../useEstimateFees";
import useConnectRoot from "../useConnectRoot";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useProxyRegister() {
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getApiPromise } = useConnectRoot();

  const [api, setApiPromise] = useState<ApiPromise>();

  const controller = useContractDetails({ action: "RegistrarController" });

  const commitExtrinsic = async (props: CommitProps) => {
    const { hash, fpAccount } = props;
    if (hash && fpAccount && api) {
      // Get transaction data using encodeFunctionData
      const data = encodeFunctionData({
        abi: controller.abi,
        functionName: "commit",
        args: [hash],
      });

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: controller.address,
        data,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

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
      const signedExtrinsic = await signExtrinsicPayload({
        api,
        address: walletAddress ?? "",
        extrinsic,
      });

      // Submit the transaction
      const result = await api.tx(signedExtrinsic).send();
      return result.toHex();
    }
  };

  const registerExtrinsic = async (props: RegisterProps) => {
    const { args } = props;
    const fpAccount = args?.futurePassAddress;

    if (args && fpAccount && api) {
      // Get transaction data using encodeFunctionData
      const data = encodeFunctionData({
        abi: controller.abi,
        functionName: "registerWithERC20",
        args: [
          args.name,
          args.owner,
          args.duration,
          args.secret,
          args.resolverAddr,
          [args.addressRecord],
          false,
          0,
          args.paymentAddress,
        ],
      });

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: controller.address,
        data,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

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
      const signedExtrinsic = await signExtrinsicPayload({
        api,
        address: walletAddress ?? "",
        extrinsic,
      });

      // Submit the transaction
      const result = await api.tx(signedExtrinsic).send();
      console.log("register-tx:: ", result);
      return result.toHex();
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const api = await getApiPromise();
      setApiPromise(api);
    };

    initialize();
  }, []);

  return {
    registerExtrinsic,
    commitExtrinsic,
  };
}
