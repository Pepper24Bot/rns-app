import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, toHex } from "viem";
import { Contract } from "ethers";
import { CALL_TYPE } from "@/interfaces/futurepass/types";
import {
  CommitProps,
  RegisterProps,
} from "@/interfaces/futurepass/registration";

import useContractDetails from "../useContractDetails";
import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useProxyRegister() {
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getFuturepassContract, signer } = useFuturePass();

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

        console.log("commit-transaction:: ", ethTx);
        return ethTx;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered during commit");
      }
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

        console.log("register-transaction:: ", ethTx);
        return ethTx;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered during registration");
      }
    }
  };

  return {
    commitProxyCall,
    registerProxyCall,
  };
}
