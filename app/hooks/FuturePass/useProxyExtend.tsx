import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, toHex } from "viem";
import { Contract } from "ethers";
import { CALL_TYPE } from "@/interfaces/futurepass/types";
import { RenewProps } from "@/interfaces/expiry";
import { ProxyProps } from "@/interfaces/proxy";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";

import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";

export default function useProxyExtend(props: ProxyProps) {
  const { registrarController } = props;
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getFuturepassContract, signer } = useFuturePass();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { futurePassAddress: fpAccount },
  } = useRootNetwork();

  const controller = registrarController!; // assert to always be not undefined
  const getEthContract = () => {
    const contract = new Contract(controller.address, controller.abi, signer);

    return contract;
  };

  const extendProxyCall = async (props: RenewProps) => {
    const { name, duration, token } = props;

    if (name && duration && fpAccount) {
      console.log(`
      name:: ${name}
      duration:: ${duration}
      fpAccount:: ${fpAccount}
      token:: ${token}
      `);

      const fpContract = getFuturepassContract(fpAccount);
      const ethContract = getEthContract();
      const extendData = ethContract.interface.encodeFunctionData(
        "renewWithERC20",
        [name, duration, token]
      );

      console.log("ethContract:: ", ethContract);

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: controller.address,
        data: extendData as Address,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Get encoded ProxyCall data
      const proxyData = fpContract.interface.encodeFunctionData("proxyCall", [
        CALL_TYPE.Call,
        ethContract.address,
        0,
        extendData,
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

        console.log("extend-transaction:: ", ethTx);
        return ethTx;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered during extend");
      }
    }
  };

  return {
    extendProxyCall,
  };
}
