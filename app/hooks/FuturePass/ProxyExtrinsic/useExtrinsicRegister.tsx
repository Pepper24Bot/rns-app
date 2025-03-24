import { CommitProps, RegisterProps } from "@/interfaces/registration";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { signExtrinsicPayload } from "@/utils/futurepass";
import { ApiPromise } from "@polkadot/api";
import "@therootnetwork/api-types"; // optional, for Typescript support
import { useEffect, useState } from "react";
import { Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

import useConnectRoot from "../../useConnectRoot";
import useContractDetails from "../../useContractDetails";
import useEstimateFees from "../../useEstimateFees";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useExtrinsicRegister() {
  const controller = useContractDetails({ action: "RegistrarController" });

  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getApiPromise } = useConnectRoot();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { futurePassAddress: futurePass },
  } = useRootNetwork();

  const [apiPromise, setApiPromise] = useState<ApiPromise>();

  const commitExtrinsic = async (props: CommitProps) => {
    const { hash } = props;
    if (hash && futurePass && apiPromise) {
      console.log("hash-extr:: ", hash);
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
      const evmCall = apiPromise.tx.evm.call(
        futurePass,
        controller.address,
        data,
        0,
        0, // gasLimit,
        maxFeePerGas,
        0,
        null,
        []
      );

      // Call ProxyExtrinsic
      const extrinsic = apiPromise.tx.futurepass.proxyExtrinsic(
        futurePass ?? "",
        evmCall
      );

      // Create Extrinsic Payload and Sign it using the wallet/eoa address
      const signedExtrinsic = await signExtrinsicPayload({
        api: apiPromise,
        address: walletAddress ?? "",
        extrinsic,
      });

      // Submit the transaction
      const result = await apiPromise.tx(signedExtrinsic).send();
      console.log("commit-extrinsic-tx:: ", result.toHex());
      return result.toHex();
    }
  };

  const registerExtrinsic = async (props: RegisterProps) => {
    const { args } = props;

    if (args && futurePass && apiPromise) {
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
      // const gasLimit = await getEstimatedGas({
      //   account: walletAddress as Address,
      //   contractAddr: controller.address,
      //   data,
      // });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Prepare Transaction Call
      const evmCall = apiPromise.tx.evm.call(
        futurePass,
        controller.address,
        data,
        0,
        0, // gasLimit,
        maxFeePerGas,
        0,
        null,
        []
      );

      // Call ProxyExtrinsic
      const extrinsic = apiPromise.tx.futurepass.proxyExtrinsic(
        futurePass ?? "",
        evmCall
      );

      // Create Extrinsic Payload and Sign it using the wallet/eoa address
      const signedExtrinsic = await signExtrinsicPayload({
        api: apiPromise,
        address: walletAddress ?? "",
        extrinsic,
      });

      // Submit the transaction
      const result = await apiPromise.tx(signedExtrinsic).send();
      console.log("register-extrinsic-toHuman:: ", result.toHuman());
      console.log("register-extrinsic-toHex:: ", result.toHex());
      console.log("---------------------");
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
