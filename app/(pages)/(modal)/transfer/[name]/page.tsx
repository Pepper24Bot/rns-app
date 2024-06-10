"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Domain } from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useGetNamesByIdAndNameQuery } from "@/redux/graphql/graphqlApi";
import { useSnackbar } from "notistack";
import useValidateName from "@/hooks/useValidateName";

export default function Page({ params }: { params: { name: string } }) {
  const name = decodeURI(params.name);
  const label = name.split(".root")[0];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const { label: normalizedLabel } = useValidateName({
    label,
  });

  const { data, isSuccess } = useGetNamesByIdAndNameQuery(
    {
      id: root.address?.toLowerCase() || "0x",
      name: `${normalizedLabel}.root`,
    },
    { skip: isEmpty(normalizedLabel) || !root.address }
  );

  const toggleTransferModal = () => {
    const domain = data?.wrappedDomains[0].domain;
    const id = data?.wrappedDomains[0].owner.id;

    toggleModal({
      id: "Transfer",
      title: "Transfer",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        domain: domain as Partial<Domain>,
        owner: { id },
        activeAddress: root.address,
      },
    });
  };

  useEffect(() => {
    if (normalizedLabel && root.address && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        toggleTransferModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${normalizedLabel}.root has been found. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    }
  }, [normalizedLabel, root.address, isSuccess]);

  return <></>;
}
