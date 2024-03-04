import { useEnsAvatar, useEnsName } from "wagmi";
import { normalize } from "viem/ens";
import { Address } from "viem";
import useContractDetails from "./useContractDetails";

export interface NameProps {
  name: string;
  owner: Address;
}

// [Mainnet:7668] UniversalResolver = 0x20814C8e689187DfF7C93A9239ea22385d13b9F1
// [Porcini:7672] UniversalResolver = 0xD65dFf392CBc5A018a385F8f31b5C57Aa5183C4D

export default function useNames(props: NameProps) {
  const { name, owner } = props;

  const { address } = useContractDetails({ action: "UniversalResolver" });

  const { data: ensAvatar } = useEnsAvatar({
    name: normalize(name),
    universalResolverAddress: address,
  });

  console.log("ensAvatar:: ", ensAvatar);

  return { avatar: ensAvatar };
}
