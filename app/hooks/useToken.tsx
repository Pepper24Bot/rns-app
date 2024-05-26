import { useWriteContract } from "wagmi";
import { Address, erc20Abi, parseUnits } from "viem";
import { ErrorResponse } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
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
  const { data: root } = useRootNetwork();
  const { approveProxyCall } = useProxyToken();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { writeContractAsync } = useWriteContract();
  const { address } = controller;

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
      const spender = address as Address;
      const tokenAddr = payment?.address as Address;
      const value = parseUnits(fee.toString(), payment?.decimals);

      if (root.isFpActive) {
        approveHash = (await approveProxyCall({
          spender,
          tokenAddr,
          amount: value,
        })) as Address;
      } else {
        approveHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddr,
          functionName: "approve",
          args: [spender, value],
        });
      }

      enqueueSnackbar("Token approval is in progress.", { variant: "info" });
      setApprovalLoading(true);
      response = await waitForWriteTransaction(approveHash);
    } catch (e) {
      const error = e as ErrorResponse;
      response.error = error;
      enqueueSnackbar(error.shortMessage, { variant: "error" });
    }

    console.log("Approval-Response:: ", response);
    setApprovalLoading(false);
    return response;
  };

  const getBalanceOf = async (props: TokenProps) => {
    const { payment = PAYMENT_METHOD[0], fee = 0 } = props;

    let response = { ...initializeResponse() };

    try {
      const tokenAddr = payment?.address as Address;
      const totalFee = parseUnits(fee.toString(), payment?.decimals);

      const balance = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddr,
        functionName: "balanceOf",
        args: [root.address as Address],
      });

      response.isSuccess = true;
      response.data = {
        balance,
        isBalanceSufficient: balance > totalFee,
      };
    } catch (e) {
      const error = e as ErrorResponse;
      response.error = error;
      enqueueSnackbar(error.shortMessage, { variant: "error" });
    }

    return response;
  };

  return {
    approve: handleApproval,
    getBalance: getBalanceOf,
    isApprovalLoading,
  };
}
