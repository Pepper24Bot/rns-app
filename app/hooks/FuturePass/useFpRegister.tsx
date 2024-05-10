import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import {
  Address,
  encodeFunctionData,
  serializeTransaction,
  toHex,
  hexToSignature,
  recoverAddress,
  recoverPublicKey,
} from "viem";
import { signExtrinsicPayload } from "@/utils/futurepass";
import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";
import { Contract, utils } from "ethers";
import { blake2AsHex } from "@polkadot/util-crypto";

import useConnectRoot from "../useConnectRoot";
import useContractDetails from "../useContractDetails";
import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";
import { FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS } from "@therootnetwork/evm";
import { CALL_TYPE } from "@/interfaces/futurepass/types";

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
    paymentAddress?: Address;
    futurePassAddress?: string;
    addressRecord?: string;
  };
}

export interface CommitProps {
  hash: string;
  fpAccount?: string;
}

export default function useFpRegister() {
  // const { getApiPromise } = useConnectRoot();
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getFuturepassContract, signer } = useFuturePass();

  const [api, setApiPromise] = useState<ApiPromise>();

  const controller = useContractDetails({ action: "RegistrarController" });

  const getEthContract = () => {
    const contract = new Contract(controller.address, controller.abi, signer);

    return contract;
  };

  const commitProxyCall = async (props: CommitProps) => {
    const { hash, fpAccount } = props;

    if (hash && fpAccount) {
      const fpContract = getFuturepassContract(fpAccount);

      const ethContract = getEthContract();
      const commitData = ethContract.interface.encodeFunctionData("commit", [
        hash,
      ]);

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: controller.address,
        data: commitData as Address,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Get encoded ProxyCall data
      const proxyData = fpContract.interface.encodeFunctionData("proxyCall", [
        CALL_TYPE.Call,
        ethContract.address,
        0,
        commitData,
      ]) as Address;

      // Send the proxy transaction
      const ethTx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: fpAccount,
            from: walletAddress,
            gas: toHex(gasLimit),
            value: 0,
            data: proxyData,
            gasPrice: toHex(maxFeePerGas),
          },
        ],
      });

      return ethTx;
    }
  };

  const registerProxyCall = async (props: RegisterProps) => {
    const { args } = props;
    const fpAccount = args?.futurePassAddress;

    if (args && fpAccount) {
      const fpContract = getFuturepassContract(fpAccount);
      const ethContract = getEthContract();

      const registerData = ethContract.interface.encodeFunctionData(
        "registerWithERC20",
        [
          args.name,
          args.owner,
          args.duration,
          args.secret,
          args.resolverAddr,
          [args.addressRecord],
          false,
          0,
          args.paymentAddress,
        ]
      );

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: controller.address,
        data: registerData as Address,
      });
      console.log("gasLimit:: ", gasLimit);

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Get encoded ProxyCall data
      const proxyData = fpContract.interface.encodeFunctionData("proxyCall", [
        CALL_TYPE.Call,
        ethContract.address,
        0,
        registerData,
      ]) as Address;

      try {
        // Send the proxy transaction
        const ethTx = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: fpAccount,
              from: walletAddress,
              gas: toHex(gasLimit),
              value: 0,
              data: proxyData,
              gasPrice: toHex(maxFeePerGas),
            },
          ],
        });

        console.log("register-ethTx:: ", ethTx);
        return ethTx;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered");
      }
    }
  };

  const commit = async (props: CommitProps) => {
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

  const register = async (props: RegisterProps) => {
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
      // const api = await getApiPromise();
      // setApiPromise(api);
    };

    initialize();
  }, []);

  return {
    registerUsingFp: register,
    commitUsingFp: commit,
    commitProxyCall,
    registerProxyCall,
  };
}
