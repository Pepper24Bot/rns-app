import "@therootnetwork/api-types"; // optional, for Typescript support
import {
  FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS,
  FUTUREPASS_REGISTRAR_PRECOMPILE_ABI,
  FUTUREPASS_PRECOMPILE_ABI,
  collectionIdToERC721Address,
  getPublicProviderUrl,
  ERC721_PRECOMPILE_ABI,
} from "@therootnetwork/evm";
import {
  Contract,
  Signer,
  Wallet,
  getDefaultProvider,
  providers,
} from "ethers";
import { useEffect, useState } from "react";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import {
  BaseProvider,
  JsonRpcBatchProvider,
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
} from "@ethersproject/providers";
import useNetworkConfig from "../useNetworkConfig";
import { useAccount } from "wagmi";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

const CALL_TYPE = {
  StaticCall: 0,
  Call: 1,
  DelegateCall: 2,
  Create: 3,
  Create2: 4,
};

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

  const getEthersWallet = () => {
    // TODO: How to create an instance of Wallet
    // Check how to get the private key
    const privateKey = process.env.NEXT_PUBLIC_MY_WALLET_PRIVATE_KEY || "";
    const wallet = new Wallet(privateKey, provider);

    return wallet;
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
    console.log("fpAccount:: ", fpAccount);

    return fpAccount;
  };

  const getFuturePass = async () => {
    const fpAccount = await getFpAccount();
    // const wallet = getEthersWallet();
    // const contract = getFuturepassContract(fpAccount).connect(wallet);
    const contract = getFuturepassContract(fpAccount).connect(signer as Signer);

    console.log("contract:: ", contract);
    return contract;
  };

  useEffect(() => {
    if (provider) {
      getJSONRpcSigner();
    }
  }, [provider]);

  useEffect(() => {
    getEthersProvider();
  }, []);

  return {
    getFuturepassContract,
    getFuturePass,
    provider,
    signer,
  };
}
