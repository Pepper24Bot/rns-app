"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import useValidateName from "@/hooks/useValidateName";
import useNamesForAddress from "@/hooks/useNamesForAddress";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Page({ params }: { params: { name: string } }) {
  const name = decodeURI(params.name);
  const label = name.split(".root")[0];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();

  const [hasMounted, setHasMounted] = useState<boolean>(false);

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

  const toggleTransferModal = () => {
    toggleModal({
      id: "Transfer",
      title: "Transfer",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        item: names[0],
        address,
      },
    });
  };

  useEffect(() => {
    setHasMounted(true);
    if (normalizedLabel && address && isSuccess) {
      if (!isEmpty(names)) {
        toggleTransferModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${normalizedLabel}.root has been found. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    }
  }, [normalizedLabel, address, isSuccess]);

  return <Dashboard tab={0} hasMounted={hasMounted} />;
}
