"use client";

import React, { useEffect } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { Domain } from "@/redux/graphql/hooks";
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

  const { data, isSuccess } = useGetNamesByNameQuery(
    { labelName: normalizedLabel },
    { skip: isEmpty(normalizedLabel) }
  );

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

  // TODO: Fix this - should allow lookup without connected wallet
  useEffect(() => {
    if (normalizedLabel && root.address && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        toggleExpiryModal();
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
