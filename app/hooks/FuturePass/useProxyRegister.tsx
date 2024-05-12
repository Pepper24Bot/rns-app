import "@therootnetwork/api-types"; // optional, for Typescript support
import { Address } from "viem";
import { Contract } from "ethers";
import { CommitProps, RegisterProps } from "@/interfaces/registration";
import { ProxyProps } from "@/interfaces/proxy";

import useSendProxyCall from "./useSendProxyCall";

export default function useProxyRegister(props: ProxyProps) {
  const { registrarController } = props;
  const { sendProxyCall } = useSendProxyCall();

  const controller = registrarController!; // assert to always be not undefined
  const getEthContract = () => {
    return new Contract(controller.address, controller.abi);
  };

  const commitProxyCall = async (props: CommitProps) => {
    const { hash } = props;

    if (hash) {
      const ethContract = getEthContract();
      const commitData = ethContract.interface.encodeFunctionData("commit", [
        hash,
      ]);

      try {
        const transaction = await sendProxyCall({
          evmContract: {
            address: ethContract.address as Address,
            data: commitData as Address,
          },
        });

        console.log("commit-transaction:: ", transaction);
        return transaction;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered during commit");
      }
    }
  };

  const registerProxyCall = async (props: RegisterProps) => {
    const { args } = props;

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

    try {
      const transaction = await sendProxyCall({
        evmContract: {
          address: ethContract.address as Address,
          data: registerData as Address,
        },
      });

      console.log("register-transaction:: ", transaction);
      return transaction;
    } catch (error) {
      console.log("error:: ", error);
      throw new Error("Error has been encountered during registration");
    }
  };

  return {
    commitProxyCall,
    registerProxyCall,
  };
}
