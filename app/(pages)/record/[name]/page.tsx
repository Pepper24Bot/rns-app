"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Domain } from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useEnsName } from "wagmi";
import { useGetNamesByIdAndNameQuery } from "@/redux/graphql/graphqlApi";
import { useSnackbar } from "notistack";

export default function Page({ params }: { params: { name: string } }) {
  const name = params.name;
  const label = name.split(".root")[0];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
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

  const toggleLinkModal = () => {
    const domain = data?.wrappedDomains[0].domain;

    toggleModal({
      id: "Link Identity",
      title: "Link Identity",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        domain: domain as Partial<Domain>,
        ensName,
      },
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (name && root.address && hasMounted && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        toggleLinkModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${name} has been found. Redirecting to the main page.`,
          { variant: "info" }
        );
      }
    }
  }, [name, root.address, hasMounted, isSuccess]);

  return <></>;
}
