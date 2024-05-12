import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, toHex } from "viem";
import { Contract } from "ethers";
import { CALL_TYPE } from "@/interfaces/futurepass/types";
import { CommitProps, RegisterProps } from "@/interfaces/registration";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { ProxyProps } from "@/interfaces/proxy";

import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";
import useContractDetails from "../useContractDetails";

export default function useProxyRegister(props: ProxyProps) {
  const { registrarController } = props;
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getFuturepassContract, signer } = useFuturePass();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { futurePassAddress: fpAccount },
  } = useRootNetwork();

  // const controller = registrarController!; // assert to always be not undefined
  const controller = useContractDetails({ action: "RegistrarController" });

  const getEthContract = () => {
    const contract = new Contract(controller.address, controller.abi, signer);

    return contract;
  };

  const commitProxyCall = async (props: CommitProps) => {
    const { hash } = props;

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
