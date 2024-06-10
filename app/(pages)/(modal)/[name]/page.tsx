"use client";

import React, { useEffect } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import { useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { isEmpty } from "lodash";
import { useDomainState } from "@/redux/domain/domainSlice";
import useValidateName from "@/hooks/useValidateName";

export default function Page({ params }: { params: { name: string } }) {
  const name = decodeURI(params.name);
  const label = name.split(".root")[0];

  const { toggleModal } = useModalState();
  const { updateName } = useDomainState();

  const { label: normalizedLabel } = useValidateName({
    label,
  });

  const { data, isSuccess } = useGetNamesByNameQuery(
    { labelName: normalizedLabel },
    { skip: isEmpty(normalizedLabel) }
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
      data: {
        name: normalizedLabel,
      },
    });
  };

  useEffect(() => {
    if (normalizedLabel && isSuccess) {
      if (!isEmpty(data.wrappedDomains)) {
        toggleDetails();
      } else {
        toggleRegistration();
      }
    }
  }, [normalizedLabel, isSuccess]);

  return <></>;
}
