import { useReadContract, useWriteContract } from "wagmi";
import { Address, namehash } from "viem";
import { Response } from "@/services/interfaces";
import { isEmpty } from "lodash";
import { getEnsText } from "viem/actions";
import { publicClient } from "@/chains/config";
import { normalize } from "viem/ens";
import useContractDetails from "./useContractDetails";

export interface Record {
  name?: string;
  address?: Address;
}

export interface FuturePassRecord {
  owner: Address;
  futurePassAddress: Address;
  resolverAddress: Address;
}

export interface PrimaryName {
  name?: string;
  address?: Address;
}

export default function useRecords(props: Record) {
  const { name } = props;

  const controller = useContractDetails({ action: "ENS" });
  const reverse = useContractDetails({ action: "ReverseRegistrar" });
  const universal = useContractDetails({ action: "UniversalResolver" });

  const { writeContractAsync: setFuturePassAsync } = useWriteContract();
  const { writeContractAsync: setPrimaryNameAsync } = useWriteContract();

  const hashedName = name ? namehash(name) : "";

  const { data: resolver } = useReadContract({
    abi: controller.abi,
    address: controller.address,
    functionName: "resolver",
    args: [hashedName],
    query: { enabled: !isEmpty(name) },
  });

  // TODO: Move this somewhere else
  const handlePrimaryName = async (props: PrimaryName) => {
    const { name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name) {
      try {
        const nameHash = namehash(name);
        const primaryResponse = await setPrimaryNameAsync({
          abi: reverse.abi,
          address: reverse.address,
          functionName: "setName",
          args: [nameHash],
        });

        console.log("response:: ", response);
        response.isSuccess = true;
        response.data = primaryResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }
    return response;
  };

  const handleFuturePassRecord = async (props: FuturePassRecord) => {
    const { owner, futurePassAddress, resolverAddress } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    try {
      const futurePassResponse = await setFuturePassAsync({
        abi: controller.abi,
        address: controller.address,
        functionName: "setRecord",
        args: [
          { key: "futurepass", value: futurePassAddress },
          owner,
          resolverAddress,
          0, // ttl - set to 0, fetch every query
        ],
      });

      console.log("futurePass-response:: ", response);
      response.isSuccess = true;
      response.data = futurePassResponse;
    } catch (error) {
      console.log("error:: ", error);
      response.error = error as string;
    }
    return response;
  };

  const getTextRecord = async (props: Record) => {
    const { name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name) {
      try {
        const ensRecordResponse = await getEnsText(publicClient, {
          name: normalize(name),
          key: "futurepass",
          universalResolverAddress: universal.address,
        });

        console.log("record-response:: ", ensRecordResponse);
        response.isSuccess = true;
        response.data = ensRecordResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }
  };

  const handleUpdateResolver = async () => {
    // TODO: implement edit resolver
  };

  const handleRemoveResolver = async () => {
    // TODO: remove resolver
  };

  return {
    setFuturePass: handleFuturePassRecord,
    setPrimaryName: handlePrimaryName,
    getTextRecord,
    resolver: resolver as unknown as string,
  };
}
