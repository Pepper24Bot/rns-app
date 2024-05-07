import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, encodeFunctionData } from "viem";
import { Payment } from "@/redux/domain/domainSlice";
import { signExtrinsicPayload } from "@/utils/futurepass";
import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";

import useConnectRoot from "../useConnectRoot";
import useContractDetails from "../useContractDetails";
import useEstimateFees from "../useEstimateFees";

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

export interface CommitProps {
  hash: string;
  fpAccount?: string;
}

export default function useFpRegister() {
  const { getApiPromise } = useConnectRoot();
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();

  const controller = useContractDetails({ action: "RegistrarController" });
  const [api, setApiPromise] = useState<ApiPromise>();

  const makeCommitment = async (props: RegisterProps) => {
    const { nameHash, args } = props;
    const fpAccount = args?.futurePassAddress;

    if (nameHash && args && fpAccount && api) {
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

  const commit = async (props: CommitProps) => {
    const { hash, fpAccount } = props;
    if (hash && fpAccount && api) {
      try {
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
      } catch (error) {
        console.log("error:: ", error);
        throw new Error(`${error}`);
      }
    }
  };

  const register = async () => {};

  useEffect(() => {
    const initialize = async () => {
      const api = await getApiPromise();
      setApiPromise(api);
    };

    initialize();
  }, []);

  return {
    registerUsingFp: register,
    makeFpCommitment: makeCommitment,
    commitFp: commit,
  };
}
