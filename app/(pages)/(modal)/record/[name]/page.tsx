"use client";

import React, { useEffect } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import useValidateName from "@/hooks/useValidateName";
import useNamesForAddress from "@/hooks/useNamesForAddress";
import SkeletonNames from "@/components/Dashboard/Tab/Names/SkeletonNames";

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

  const toggleLinkModal = () => {
    toggleModal({
      id: "Link Identity",
      title: "Link Identity",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        address,
        item: names[0],
      },
    });
  };

  useEffect(() => {
    if (normalizedLabel && address && isSuccess) {
      if (!isEmpty(names)) {
        toggleLinkModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${normalizedLabel}.root has been found. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    }
  }, [normalizedLabel, address, isSuccess]);

  return <SkeletonNames />;
}
