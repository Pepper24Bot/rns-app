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
import { utils } from "ethers";
import { blake2AsHex } from "@polkadot/util-crypto";

import useConnectRoot from "../useConnectRoot";
import useContractDetails from "../useContractDetails";
import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";

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

const CALL_TYPE = {
  StaticCall: 0,
  Call: 1,
  DelegateCall: 2,
  Create: 3,
  Create2: 4,
};

export default function useFpRegister() {
  const { getApiPromise } = useConnectRoot();
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getFuturepassContract, getFuturePass, signer } = useFuturePass();

  const controller = useContractDetails({ action: "RegistrarController" });

  const [api, setApiPromise] = useState<ApiPromise>();

  const commitEvm = async (props: CommitProps) => {
    const { hash, fpAccount } = props;

    console.log("fpAccount:: ", fpAccount);

    if (hash && fpAccount) {
      const fpContract = getFuturepassContract(fpAccount);
      const data = new utils.Interface(controller.abi).encodeFunctionData(
        "commit",
        [hash]
      ) as Address;

      console.log("fpContract:: ", fpContract);
      // fpAccount,
      //       controller.address,
      //       data,
      //       0,
      //       gasLimit,
      //       maxFeePerGas,
      //       0,
      //       null,
      //       []

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: controller.address,
        data,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      const unsignedTx = {
        type: 2,
        from: fpAccount,
        to: controller.address,
        nonce: null,
        data,
        gasLimit,
        maxFeePerGas,
      };

      // const serialized = serializeTransaction(unsignedTx)
      // const txData = toHex(unsignedTx);

      // const hashed = data.length > (256 + 1) * 2 ? blake2AsHex(data) : data;
      // const ethPayload = blake2AsHex(hashed);

      const message = toHex("approve: commit transaction");

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });
      console.log("signature:: ", signature);

      const parsedSignature = hexToSignature(signature);
      console.log("parsedSignature:: ", parsedSignature);
      // console.log("ethPayload:: ", ethPayload);

      const recoveredAddr = await recoverAddress({
        hash: message,
        signature,
      });
      console.log("recoveredAddr:: ", recoveredAddr);

      const publicKey = await recoverPublicKey({
        hash: message,
        signature,
      });
      console.log("publicKey:: ", publicKey);

      // fp.provider.
      const tx = await fpContract.proxyCall(
        CALL_TYPE.Call,
        controller.address,
        "0",
        data
      );

      console.log("transaction:: ", tx);

      // const receipt =
      //   (await makeCommitmentTx.wait()) as unknown as ContractReceipt;
      // console.log("receipt:: ", receipt);
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

      console.log("encoded:: ", data);
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
      const api = await getApiPromise();
      setApiPromise(api);
    };

    initialize();
  }, []);

  return {
    registerUsingFp: register,
    commitUsingFp: commit,
    commitEvm,
  };
}
