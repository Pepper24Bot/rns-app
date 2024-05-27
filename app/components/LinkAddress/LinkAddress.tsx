import React from "react";
import { EMPTY_ADDRESS } from "@/constants/components";
import { LinkProps } from "@/interfaces/components/transaction";
import { useEnsAddress } from "wagmi";

import AddRecord from "./AddRecord";
import AddressRecord from "./AddressRecord";

export const LinkAddress: React.FC<LinkProps> = (props: LinkProps) => {
  const { domain } = props;

  const { data: ensAddr } = useEnsAddress({
    name: domain?.name || "",
  });

  const hasLinkedAddr = ensAddr && ensAddr !== EMPTY_ADDRESS;

  return hasLinkedAddr ? (
    <AddressRecord {...props} />
  ) : (
    <AddRecord {...props} />
  );
};

export default LinkAddress;
