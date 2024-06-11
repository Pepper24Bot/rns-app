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
    skip: !normalizedLabel,
    address: address ?? "0x",
    filter: {
      searchString: `${normalizedLabel}.root`,
      searchType: "name",
    },
  });

  const toggleExpiryModal = () => {
    toggleModal({
      id: "Extend Expiry",
      title: "Extend Expiry",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        item: names[0],
        address,
      },
    });
  };

  // TODO: Fix this - should allow lookup without connected wallet
  useEffect(() => {
    if (normalizedLabel && address && isSuccess) {
      if (!isEmpty(names)) {
        toggleExpiryModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${normalizedLabel}.root has been found. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    }
  }, [normalizedLabel, address, isSuccess]);

  return <></>;
}
