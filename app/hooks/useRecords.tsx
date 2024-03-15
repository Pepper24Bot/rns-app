import { useSendTransaction, useWalletClient, useWriteContract } from "wagmi";
import { Address, encodeFunctionData, namehash } from "viem";
import { Response } from "@/services/interfaces";
import { getEnsText } from "viem/actions";
import { publicClient, walletClient } from "@/chains/config";
import { normalize } from "viem/ens";
import useContractDetails from "./useContractDetails";

export interface Record {
  name?: string;
  address?: Address;
  key?: string;
  resolverAddress?: Address;
  owner?: Address;
}

export interface FuturePassRecord extends Record {
  futurePassAddress: Address;
}

export interface PrimaryName {
  name?: string;
  address?: Address;
}

export default function useRecords() {
  const ens = useContractDetails({ action: "ENS" });
  const reverse = useContractDetails({ action: "ReverseRegistrar" });
  const universal = useContractDetails({ action: "UniversalResolver" });
  const ownedResolver = useContractDetails({ action: "OwnedResolver" });
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { writeContractAsync: setRecordAsync } = useWriteContract();
  const { writeContractAsync: setPrimaryNameAsync } = useWriteContract();
  const { writeContractAsync: setFuturePassAsync } = useWriteContract();

  const { sendTransaction, error, data, failureReason } = useSendTransaction();
  const wallet = useWalletClient();
  // console.log("client:: ", result);

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

  /**
   *
   * Writes Text Record
   * https://github.com/ensdomains/ensjs-v3/blob/7e01ad8579c08b453fc64b1972b764b6d884b774/packages/ensjs/src/functions/wallet/deleteSubname.ts#L106
   * @param props
   * @returns
   */
  const handleRecord = async (props: Record) => {
    const { owner, resolverAddress, name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name && owner && resolverAddress) {
      const nameHash = namehash(name);
      try {
        const recordResponse = await setRecordAsync({
          abi: ens.abi,
          address: ens.address,
          functionName: "setRecord",
          args: [
            nameHash,
            owner,
            resolverAddress,
            BigInt(0), // ttl - set to 0, fetch every query
          ],
        });

        console.log("record-response:: ", response);
        response.isSuccess = true;
        response.data = recordResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }

    return response;
  };

  /**
   *
   * @param props
   * @returns
   */
  const handleAddressRecord = async (props: FuturePassRecord) => {
    const { name, futurePassAddress, owner, resolverAddress } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    console.log("props:: ", props);
    // 0xFfFFFFff00000000000000000000000000038E08

    if (name && resolverAddress) {
      const nameHash = namehash(name);

      // const encodedFunction = encodeFunctionData({
      //   abi: ownedResolver.abi,
      //   functionName: "setAddr",
      //   args: [nameHash, 60, futurePassAddress],
      // });

      const encodedFunction = encodeFunctionData({
        abi: ownedResolver.abi,
        functionName: "setText",
        args: [nameHash, "futurepass", futurePassAddress],
      });

      console.log("encodedFunction:: ", encodedFunction);

      try {
        // const addressResponse = await setFuturePassAsync({
        //   abi: ownedResolver.abi,
        //   address: ownedResolver.address,
        //   functionName: "setAddr",
        //   args: [
        //     nameHash,
        //     60, // coin type -- 1 = all test net, 60 = eth
        //     futurePassAddress, // address to link ens name to
        //   ],
        // });

        const addressResponse = sendTransaction({
          to: resolverAddress,
          data: encodedFunction,
        });

        console.log("address-response:: ", addressResponse);
        response.isSuccess = true;
        response.data = addressResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
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
    setRecord: handleRecord,
    setFuturePass: handleAddressRecord,
    setPrimaryName: handlePrimaryName,
    getTextRecord,
    failureReason,
    error,
    data,
  };
}
