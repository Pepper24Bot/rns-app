import "@therootnetwork/api-types"; // optional, for Typescript support
import {
  FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS,
  FUTUREPASS_REGISTRAR_PRECOMPILE_ABI,
  FUTUREPASS_PRECOMPILE_ABI,
  getPublicProviderUrl,
} from "@therootnetwork/evm";
import { Contract, Signer, providers } from "ethers";
import { useState } from "react";
import {
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
} from "@ethersproject/providers";
import { useAccount } from "wagmi";
import useNetworkConfig from "../useNetworkConfig";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useFuturePass() {
  const { address: walletAddress } = useAccount();
  const { network } = useNetworkConfig();

  const [provider, setProvider] = useState<JsonRpcProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();

  const getEthersProvider = () => {
    const providerUrl = getPublicProviderUrl(network);
    const provider = new providers.JsonRpcProvider(providerUrl);

    setProvider(provider);
  };

  const getJSONRpcSigner = () => {
    const addr = walletAddress;
    const signer = provider?.getSigner(addr);

    setSigner(signer);
  };

  const getFuturepassRegistrarContract = () => {
    return new Contract(
      FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS,
      FUTUREPASS_REGISTRAR_PRECOMPILE_ABI
    );
  };

  const getFuturepassContract = (fpAccount: string) => {
    return new Contract(fpAccount, [...FUTUREPASS_PRECOMPILE_ABI], signer);
  };

  const getFpAccount = async () => {
    const registrar = getFuturepassRegistrarContract().connect(
      provider as Provider
    );
    const fpAccount = await registrar.futurepassOf(walletAddress);

    return fpAccount;
  };

  const getFuturePass = async () => {
    const fpAccount = await getFpAccount();
    const contract = getFuturepassContract(fpAccount).connect(signer as Signer);
    return contract;
  };

  return {
    getEthersProvider,
    getJSONRpcSigner,
    getFuturepassContract,
    getFuturePass,
    getFpAccount,
    provider,
    signer,
  };
}
