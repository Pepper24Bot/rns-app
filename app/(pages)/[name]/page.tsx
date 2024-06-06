"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount } from "wagmi";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { useGetNamesByNameQuery } from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";
import { useDomainState } from "@/redux/domain/domainSlice";

export default function Page({ params }: { params: { name: string } }) {
  const name = params.name;
  const label = name.split(".root")[0];

  const { address } = useAccount();
  const { toggleModal } = useModalState();
  const { updateName } = useDomainState();

  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const { data, isSuccess } = useGetNamesByNameQuery(
    { labelName: label },
    { skip: name === null || isEmpty(root?.address) }
  );

  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const toggleDetails = () => {
    toggleModal({
      id: "Registration Details",
      title: "Registration Details",
      data: {
        // use label then append .root, in case the user search for a label only
        name: `${label}.root`,
        domain: data?.wrappedDomains[0],
        isSuccess,
      },
    });
  };

  const toggleRegistration = () => {
    updateName({ name: label || "" });
    toggleModal({
      id: "Register Name",
      title: "Register",
      isCloseDisabled: true,
      isXDisabled: true,
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (name && address && hasMounted && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        toggleDetails();
      } else {
        toggleRegistration();
      }
    }
  }, [name, address, hasMounted, isSuccess]);

  return <></>;
}
