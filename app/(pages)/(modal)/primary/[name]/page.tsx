"use client";

import React, { useEffect } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import useValidateName from "@/hooks/useValidateName";
import useNamesForAddress from "@/hooks/useNamesForAddress";

export default function Page({ params }: { params: { name: string } }) {
  const name = decodeURI(params.name);
  const label = name.split(".root")[0];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();

  const {
    data: { address },
  } = useRootNetwork();

  const { label: normalizedLabel } = useValidateName({
    label,
  });

  const { names, isSuccess } = useNamesForAddress({
    skip: !normalizedLabel || !address,
    address: address ?? "0x",
    filter: {
      searchString: `${normalizedLabel}.root`,
      searchType: "name",
    },
  });

  const togglePrimaryModal = () => {
    toggleModal({
      id: "Set as Primary",
      title: "Set as Primary",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        item: names[0],
        address,
      },
    });
  };

  useEffect(() => {
    if (normalizedLabel && address && isSuccess) {
      if (!isEmpty(names)) {
        togglePrimaryModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${normalizedLabel} has been found. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    }
  }, [normalizedLabel, address, isSuccess]);

  return <></>;
}
