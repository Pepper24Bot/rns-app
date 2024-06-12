import { useWriteContract } from "wagmi";
import { isEmpty } from "lodash";
import { config } from "@/chains/config";
import { useEffect, useState } from "react";
import { SECONDS } from "@/constants/components";
import { readContract } from "@wagmi/core";
import { ErrorResponse, RentPrice } from "@/services/interfaces";
import { ExtendProps, RenewProps } from "@/interfaces/expiry";
import { Address } from "viem";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { initializeResponse } from "@/utils/common";
import { useSnackbar } from "notistack";

import useContractDetails from "./useContractDetails";
import useProxyExtend from "./FuturePass/useProxyExtend";
import useWaitTransaction from "./useWaitTransaction";

/** TODO: Optimize this hook */
export default function useExtend(props: ExtendProps) {
  // console.log("================ useExtend ================");
  const { name, year, token, isEnabled } = props;
  const controller = useContractDetails({ action: "RegistrarController" });

  const { enqueueSnackbar } = useSnackbar();
  const { abi, address } = controller;
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { writeContractAsync } = useWriteContract();
  const { extendProxyCall } = useProxyExtend({
    registrarController: controller,
  });

  const initialRentPrice: RentPrice = {
    base: BigInt(0),
    premium: BigInt(0),
  };

  const [isExtendLoading, setExtendLoading] = useState(false);
  const [isRentLoading, setRentLoading] = useState(false);

  const [rentPrice, setRentPrice] = useState<RentPrice>(initialRentPrice);

  const duration = year * SECONDS;

  const getRentPrice = async () => {
    setRentLoading(true);
    const data = await readContract(config, {
      abi,
      address,
      functionName: "rentERC20Price",
      args: [token, name, duration],
    });

    setRentLoading(false);
    setRentPrice(data as unknown as RentPrice);
  };

  const getRentFee = () => {
    return rentPrice ? (rentPrice as unknown as RentPrice) : initialRentPrice;
  };

  const handleExtend = async (props: RenewProps) => {
    const { name, duration } = props;
    let response = { ...initializeResponse() };

    if (name && duration) {
      try {
        let renewHash = "0x" as Address;

        if (root.isFpActive) {
          renewHash = (await extendProxyCall({
            name,
            duration,
            token,
          })) as Address;
        } else {
          renewHash = await writeContractAsync({
            abi,
            address,
            functionName: "renewWithERC20",
            account: root.address as Address,
            args: [name, duration, token],
          });
        }

        enqueueSnackbar(
          `Extending the expiry date of ${name}.root is in progress.`,
          { variant: "info" }
        );
        setExtendLoading(true);
        response = await waitForWriteTransaction(renewHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
        const message = error.shortMessage || error.message;
        enqueueSnackbar(message, { variant: "error" });
      }
    }

    setExtendLoading(false);
    console.log("Extend-Response:: ", response);
    return response;
  };

  useEffect(() => {
    if (!isEmpty(name) && isEnabled) {
      // console.log("=============================");
      // console.log("name:: ", name);
      // console.log("isEnabled:: ", isEnabled);
      // console.log("duration:: ", duration);
      // console.log("token:: ", token);
      // console.log("isRentLoading:: ", isRentLoading);
      getRentPrice();
    }
  }, [name, isEnabled, duration, token]);

  return {
    duration,
    rentPrice: getRentFee(),
    renew: handleExtend,
    isLoading: isExtendLoading,
    isExtendLoading,
  };
}
