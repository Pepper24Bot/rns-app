import React from "react";
import { EMPTY_ADDRESS } from "@/constants/components";
import { LinkProps } from "@/interfaces/components/transaction";

import AddRecord from "./AddRecord";
import AddressRecord from "./AddressRecord";

export const LinkAddress: React.FC<LinkProps> = (props: LinkProps) => {
  const { item } = props;
  const { resolvedAddress: ensAddr } = item;

  const hasLinkedAddr = ensAddr && ensAddr !== EMPTY_ADDRESS;

  return hasLinkedAddr ? (
    <AddressRecord {...props} />
  ) : (
    <AddRecord {...props} />
  );
};

export default LinkAddress;
