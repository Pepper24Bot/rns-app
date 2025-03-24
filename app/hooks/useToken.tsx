import { useWriteContract } from "wagmi";
import { Address, erc20Abi, parseUnits } from "viem";
import { ErrorResponse } from "@/services/interfaces";
import { Payment } from "@/redux/form/formSlice";
import { PAYMENT_METHOD } from "@/constants/components";
import { readContract } from "@wagmi/core";
import { config } from "@/chains/config";
import { useState } from "react";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { initializeResponse } from "@/utils/common";
import { useSnackbar } from "notistack";

import useContractDetails from "./useContractDetails";
import useProxyToken from "./FuturePass/useProxyToken";
import useWaitTransaction from "./useWaitTransaction";
import useExtrinsicTokenApproval from "./FuturePass/ProxyExtrinsic/useExtrinsicTokenApproval";

export interface TokenProps {
  payment?: Payment;
  fee?: number;
  address?: Address;
  fpAccount?: Address;
}

export default function useToken() {
  const controller = useContractDetails({ action: "RegistrarController" });

  const { enqueueSnackbar } = useSnackbar();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address, isFpActive },
  } = useRootNetwork();
  const { approveProxyCall } = useProxyToken();
  const { approveTokenExtrinsic } = useExtrinsicTokenApproval();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { writeContractAsync } = useWriteContract();
  const { address: controllerAddr } = controller;

  const [isBalanceLoading, setBalanceLoading] = useState(false);
  const [isApprovalLoading, setApprovalLoading] = useState(false);

  /**
   *
   * @param props
   * @returns
   */
  const handleApproval = async (props: TokenProps) => {
    const { payment = PAYMENT_METHOD[0], fee = 0 } = props;

    let response = { ...initializeResponse() };

    try {
      let approveHash = "0x" as Address;

      // The spender is the ETHRegistrarCntroller address
      const spender = controllerAddr as Address;
      const tokenAddr = payment?.address as Address;
      const value = parseUnits(fee.toString(), payment?.decimals);

      if (isFpActive) {
        // approveHash = (await approveProxyCall({
        //   spender,
        //   tokenAddr,
        //   amount: value,
        // })) as Address;
        setApprovalLoading(true);
        approveHash = (await approveTokenExtrinsic({
          spender,
          tokenAddr,
          amount: value,
        })) as Address;

        response = {
          isSuccess: true,
          error: null,
          data: {
            hash: approveHash,
            receipt: approveHash,
          },
        };
      } else {
        approveHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddr,
          functionName: "approve",
          args: [spender, value],
        });

        response = await waitForWriteTransaction(approveHash);
      }

      enqueueSnackbar("Token approval is in progress.", { variant: "info" });
    } catch (e) {
      const error = e as ErrorResponse;
      response.error = error;
      const message = error.shortMessage || error.message;
      enqueueSnackbar(message, { variant: "error" });
    }

    console.log("Approval-Response:: ", response);
    setApprovalLoading(false);
    return response;
  };

  const getBalanceOf = async (props: TokenProps) => {
    const { payment = PAYMENT_METHOD[0], fee = 0 } = props;

    let response = { ...initializeResponse() };

    try {
      setBalanceLoading(true);
      const tokenAddr = payment?.address as Address;
      const totalFee = parseUnits(fee.toString(), payment?.decimals);

      const balance = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddr,
        functionName: "balanceOf",
        args: [address as Address],
      });

      setBalanceLoading(false);
      response.isSuccess = true;
      response.data = {
        balance,
        isBalanceSufficient: balance > totalFee,
      };
    } catch (e) {
      const error = e as ErrorResponse;
      response.error = error;
      const message = error.shortMessage || error.message;
      setBalanceLoading(false);
      enqueueSnackbar(message, { variant: "error" });
    }

    return response;
  };

  return {
    approve: handleApproval,
    getBalance: getBalanceOf,
    isApprovalLoading,
    isBalanceLoading,
  };
}
