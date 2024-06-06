"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Domain } from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useGetNamesByIdAndNameQuery } from "@/redux/graphql/graphqlApi";
import { useEnsName } from "wagmi";

export default function Page({ params }: { params: { name: string } }) {
  const name = params.name;
  const label = name.split(".root")[0];

  const router = useRouter();

  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const { data, isSuccess } = useGetNamesByIdAndNameQuery(
    { id: root.address?.toLowerCase() || "0x", name: `${label}.root` },
    { skip: name === null || !root.address }
  );

  const { data: ensName } = useEnsName({
    address: root.address || "0x",
  });

  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const togglePrimaryModal = () => {
    const domain = data?.wrappedDomains[0].domain;

    toggleModal({
      id: "Set as Primary",
      title: "Set as Primary",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        domain: domain as Partial<Domain>,
        ensName,
        activeAddress: root.address,
      },
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (name && root.address && hasMounted && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        togglePrimaryModal();
      } else {
        router.replace("/", { scroll: false });
      }
    }
  }, [name, root.address, hasMounted, isSuccess]);

  return <></>;
}
