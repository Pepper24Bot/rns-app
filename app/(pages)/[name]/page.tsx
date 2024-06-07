"use client";

import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { isEmpty } from "lodash";
import { useDomainState } from "@/redux/domain/domainSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { isNameSupported } from "@/utils/common";
import { normalize } from "viem/ens";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

export default function Page({ params }: { params: { name: string } }) {
  const name = decodeURI(params.name);
  const label = name.split(".root")[0];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useModalState();
  const { updateName } = useDomainState();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [normalizedLabel, setNormalizedLabel] = useState<string>("");

  const { data, isSuccess } = useGetNamesByNameQuery(
    { labelName: normalizedLabel },
    { skip: normalizedLabel === "" }
  );

  const toggleDetails = () => {
    toggleModal({
      id: "Registration Details",
      title: "Registration Details",
      data: {
        // use label then append .root, in case the user search for a label only
        name: `${normalizedLabel}.root`,
        domain: data?.wrappedDomains[0],
        isSuccess,
      },
    });
  };

  const toggleRegistration = () => {
    updateName({ name: normalizedLabel || "" });
    toggleModal({
      id: "Register Name",
      title: "Register",
      isCloseDisabled: true,
      isXDisabled: true,
    });
  };

  const validateName = () => {
    const supported = isNameSupported(label);

    if (supported) {
      try {
        const normalized = normalize(label);
        setNormalizedLabel(normalized);
      } catch (error) {
        router.replace("/", { scroll: false });
        enqueueSnackbar(
          `Unable to normalize ${name}. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    } else {
      router.replace("/", { scroll: false });
      enqueueSnackbar(`${name} is not supported. Redirecting to main page.`, {
        variant: "info",
      });
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && name) {
      validateName();
    }
  }, [hasMounted, name]);

  useEffect(() => {
    if (normalizedLabel && root.address && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        toggleDetails();
      } else {
        toggleRegistration();
      }
    }
  }, [normalizedLabel, root.address, isSuccess]);

  return <></>;
}
