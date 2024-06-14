"use client";

import React, { useEffect } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { isEmpty } from "lodash";

import useValidateName from "@/hooks/useValidateName";
import useWrappedData from "@/hooks/useWrappedData";
import useNamesForAddress from "@/hooks/useNamesForAddress";
import SkeletonNames from "@/components/Dashboard/Tab/Names/SkeletonNames";

export default function Page({ params }: { params: { name: string } }) {
  const name = decodeURI(params.name);
  const label = name.split(".root")[0];

  const { toggleModal } = useModalState();

  const { label: normalizedLabel } = useValidateName({
    label,
  });

  const { name: wrappedName, isSuccess } = useWrappedData({
    name: `${normalizedLabel}.root`,
    skip: !normalizedLabel,
  });

  const { names, isSuccess: isNameSuccess } = useNamesForAddress({
    skip: !normalizedLabel || !wrappedName?.owner,
    address: wrappedName?.owner ?? "0x",
    filter: {
      searchString: `${normalizedLabel}.root`,
      searchType: "name",
    },
  });

  const toggleDetails = () => {
    toggleModal({
      id: "Registration Details",
      title: "Registration Details",
      data: {
        item: names[0],
        isSuccess: isNameSuccess,
      },
    });
  };

  const toggleRegistration = () => {
    toggleModal({
      id: "Register Name",
      title: "Register",
      isCloseDisabled: true,
      isXDisabled: true,
      data: {
        name: normalizedLabel,
      },
    });
  };

  useEffect(() => {
    if (normalizedLabel && isSuccess) {
      if (isEmpty(wrappedName)) {
        toggleRegistration();
      } else if (isNameSuccess && !isEmpty(names)) {
        toggleDetails();
      }
    }
  }, [normalizedLabel, isSuccess, isNameSuccess]);

  return <SkeletonNames />;
}
