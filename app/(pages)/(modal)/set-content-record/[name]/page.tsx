"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import useValidateName from "@/hooks/useValidateName";
import useWrappedData from "@/hooks/useWrappedData";
import Dashboard from "@/components/Dashboard/Dashboard";
import useAllNamesForAddress from "@/hooks/useAllNamesForAddress";
import { useReadContract } from "wagmi";
import { PUBLIC_RESOLVER } from "@/abis/root/PublicResolver";
import { namehash } from "viem";

export default function Page({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
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

  const { name: wrappedName } = useWrappedData({
    name: `${normalizedLabel}.root`,
    skip: !normalizedLabel,
  });

  const { names, isFetched: isNameSuccess } = useAllNamesForAddress({
    skip: !normalizedLabel || !wrappedName?.owner,
    filter: {
      name: `${normalizedLabel}.root`,
      address: wrappedName?.owner ?? "0x",
    },
  });

  const { data, isSuccess } = useReadContract({
    abi: PUBLIC_RESOLVER.abi,
    address: PUBLIC_RESOLVER.address as `0x${string}`,
    functionName: "contenthash",
    args: [namehash(`${name}.root`)],
  });

  const toggleContentModal = () => {
    toggleModal({
      id: "Set Content Record",
      title: "Set Content Record",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        item: names[0],
        address,
        contentHash: data,
      },
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setHasMounted(true);
    if (normalizedLabel && address && isNameSuccess && isSuccess) {
      if (!isEmpty(names)) {
        toggleContentModal();
      } else {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `No ${normalizedLabel}.root has been found. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    }
  }, [normalizedLabel, address, isNameSuccess, isSuccess, enqueueSnackbar]);

  return <Dashboard tab={0} hasMounted={hasMounted} />;
}
