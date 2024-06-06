"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { Domain } from "@/redux/graphql/hooks";
import { useSnackbar } from "notistack";

export default function Page({ params }: { params: { name: string } }) {
  const name = params.name;
  const label = name.split(".root")[0];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const { data, isSuccess } = useGetNamesByNameQuery(
    { labelName: label },
    { skip: name === null }
  );

  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const toggleExpiryModal = () => {
    const domain = data?.wrappedDomains[0].domain;

    toggleModal({
      id: "Extend Expiry",
      title: "Extend Expiry",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        domain: domain as Partial<Domain>,
      },
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (name && root.address && hasMounted && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        toggleExpiryModal();
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
