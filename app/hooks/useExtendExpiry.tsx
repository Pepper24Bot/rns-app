import { useWriteContract } from "wagmi";
import { isEmpty } from "lodash";
import { config } from "@/chains/config";
import { useEffect, useState } from "react";
import { SECONDS } from "@/constants/components";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { ErrorResponse, RentPrice, Response } from "@/services/interfaces";
import { ExtendProps, RenewProps } from "@/interfaces/expiry";
import { Address } from "viem";

import useContractDetails from "./useContractDetails";
import useProxyExtend from "./FuturePass/useProxyExtend";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";

/** TODO: Optimize this hook */
export default function useExtend(props: ExtendProps) {
  const { name, year, owner, token, isEnabled } = props;

  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const controller = useContractDetails({ action: "RegistrarController" });
  const { abi, address } = controller;
  const { writeContractAsync } = useWriteContract();
  const { extendProxyCall } = useProxyExtend({
    registrarController: controller,
  });

  const initialRentPrice: RentPrice = {
    base: BigInt(0),
    premium: BigInt(0),
  };

  const [isExtendLoading, setExtendLoading] = useState(false);
  const [rentPrice, setRentPrice] = useState<RentPrice>(initialRentPrice);

  const duration = year * SECONDS;

  const initializeResponse = (): Response => {
    return { error: null, isSuccess: false, data: null };
  };

  const getRentPrice = async () => {
    const data = await readContract(config, {
      abi,
      address,
      functionName: "rentERC20Price",
      args: [token, name, duration],
    });

    setRentPrice(data as unknown as RentPrice);
  };

  const waitForTransaction = async (hash: Address) => {
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

  const handleExtend = async (props: RenewProps) => {
    const { name, duration } = props;
    let response = { ...initializeResponse() };

    if (name && duration) {
      try {
        if (root.isFpActive) {
          const renewHash = await extendProxyCall({
            name,
            duration,
            token,
          });
          setExtendLoading(true);
          response = await waitForTransaction(renewHash);
        } else {
          const renewHash = await writeContractAsync({
            abi,
            address,
            functionName: "renewWithERC20",
            account: owner as Address,
            args: [name, duration, token],
          });
          setExtendLoading(true);
          response = await waitForTransaction(renewHash);
        }
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
      }
    }

    setExtendLoading(false);
    console.log("extend response:: ", response);
    return response;
  };

  useEffect(() => {
    if (!isEmpty(name) && isEnabled) {
      getRentPrice();
    }
  }, [name, isEnabled, duration, token]);

  const rentFee = rentPrice
    ? (rentPrice as unknown as RentPrice)
    : initialRentPrice;

  return {
    duration,
    rentPrice: rentFee,
    renew: handleExtend,
    isLoading: isExtendLoading,
    isExtendLoading,
  };
}
