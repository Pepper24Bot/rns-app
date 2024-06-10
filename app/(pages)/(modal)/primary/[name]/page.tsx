"use client";

import React, { useEffect } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Domain } from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useGetNamesByIdAndNameQuery } from "@/redux/graphql/graphqlApi";
import { useEnsName } from "wagmi";
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

  const { data: ensName } = useEnsName({
    address: root.address || "0x",
  });

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
    if (normalizedLabel && root.address && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        togglePrimaryModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${name} has been found. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    }
  }, [normalizedLabel, root.address, isSuccess]);

  return <></>;
}
