import "@therootnetwork/api-types"; // optional, for Typescript support
import { getApiOptions, getPublicProvider } from "@therootnetwork/api";
import {
  FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS,
  FUTUREPASS_REGISTRAR_PRECOMPILE_ABI,
  FUTUREPASS_PRECOMPILE_ABI,
  collectionIdToERC721Address,
  getPublicProviderUrl,
  ERC721_PRECOMPILE_ABI,
  ERC20_ABI,
} from "@therootnetwork/evm";
import {
  Contract,
  ContractReceipt,
  Signer,
  getDefaultProvider,
  utils,
} from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useConnectors, useWalletClient } from "wagmi";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { BaseProvider, Provider } from "@ethersproject/providers";
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  fromBytes,
  fromHex,
  parseUnits,
  toHex,
} from "viem";
import { Payment } from "@/redux/domain/domainSlice";
import { EMPTY_ADDRESS, PAYMENT_METHOD } from "@/constants/components";
import { estimateGas, getFeeHistory } from "@wagmi/core";
import { config } from "@/chains/config";

import useConnectRoot from "../useConnectRoot";
import useFuturePass from "./useFuturePass";
import useContractDetails from "../useContractDetails";
import { createExtrinsicPayload, sendExtrinsic } from "@/utils/futurepass";
import { Extrinsic } from "@polkadot/types/interfaces";
import { AddressOrPair } from "@polkadot/api/types";
import { hexToU8a } from "@polkadot/util";
import { signatureVerify, mnemonicGenerate } from "@polkadot/util-crypto";
import { api } from "@/redux/baseSlice";
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

const CALL_TYPE = {
  StaticCall: 0,
  Call: 1,
  DelegateCall: 2,
  Create: 3,
  Create2: 4,
};

export default function useFpRegister(props?: ConnectProps) {
  const { getFuturepassContract, getFuturePass, signer } = useFuturePass();
  const { getApiPromise } = useConnectRoot();
  const { address: walletAddress } = useAccount();

  const controller = useContractDetails({ action: "RegistrarController" });

  const makeCommitmentV1 = async (props: RegisterProps) => {
    const { nameHash, args } = props;

    const fp = await getFuturePass();
    const fpAccount = fp.address;

    console.log("fp:: ", fp);

    if (nameHash && args) {
      const makeCommitment = new utils.Interface(
        controller.abi
      ).encodeFunctionData("makeCommitment", [
        args.name,
        fpAccount,
        args.duration,
        args.secret,
        args.resolverAddr,
        [args.addressRecord],
        false,
        0,
      ]);

      const message = toHex("Make a commitment");

      // const signer = await fp.signer.signMessage(makeCommitment);
      console.log("signer:: ", signer);
      fp.attach;

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });
      console.log("signature:: ", signature);

      // fp.provider.
      const makeCommitmentTx = await fp.proxyCall(
        CALL_TYPE.Call, // View Function
        controller.address, // EthRegistrarController Address
        "0",
        makeCommitment // encodeFunctionData
      );

      console.log("transaction:: ", makeCommitmentTx);

      // const receipt =
      //   (await makeCommitmentTx.wait()) as unknown as ContractReceipt;
      // console.log("receipt:: ", receipt);
    }
  };

  const makeCommitment = async (props: RegisterProps) => {
    const { nameHash, args } = props;
    const api = await getApiPromise("root");

    // TODO: Check which dependency causes to make the unwrapOr function not available in Codec
    const fpAccount = (await api.query.futurepass.holders(walletAddress || ""))
      .unwrapOr(undefined)
      ?.toString();

    console.log("fpAccount:: ", fpAccount);

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

      // TODO: Unused - how to implement signer and use it
      const keyring = new Keyring({ type: "ethereum" });
      const signer = keyring.addFromAddress(walletAddress ?? "");

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

      // Create Extrinsic Payload and Sign it?
      // TODO: Fix this
      const { payload, message } = await createExtrinsicPayload({
        api,
        signer: walletAddress ?? "",
        extrinsic,
      });

      // Get the user to sign
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });

      const isSignatureValid = signatureVerify(
        message,
        signature,
        walletAddress ?? ""
      );

      console.log("signature:: ", signature);
      console.log("isSignatureValid:: ", isSignatureValid);
      console.log("publicKey:: ", toHex(isSignatureValid.publicKey));

      // Add the signature to the extrinsic
      const signedExtrinsic = extrinsic.addSignature(
        fpAccount ?? "",
        signature as `0x${string}`,
        payload
      );

      // TODO: Create a wrapper
      const result = await api.tx(signedExtrinsic).send();

      // const result = await sendExtrinsic({
      //   extrinsic,
      //   signer: alice,
      // });
      console.log("---------------------");
    }
  };

  /**
   * function proxyCall(uint8 callType, address callTo, uint256 value, bytes memory callData) external payable;
   * See docs: https://docs.therootnetwork.com/buidl/evm/precompile-futurepass
   */
  const register = async () => {};

  return {
    registerUsingFp: register,
    makeFpCommitment: makeCommitment,
  };
}
