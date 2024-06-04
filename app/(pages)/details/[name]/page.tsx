"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useModalState } from "@/redux/modal/modalSlice";

import MainPage from "@/components/Main/MainPage";

export const RegistrationDetails: React.FC = () => {
  const pathname = usePathname();

  const { toggleModal } = useModalState();

  const name = pathname.split("/details/")[1];
  const label = name.split(".root")[0];

  useEffect(() => {
    if (label) {
      toggleModal({
        id: "Registration Details",
        title: "Registration Details",
        data: {
          name: label,
          status: "Registered",
        },
      });
    }
  }, [label]);

  return <MainPage />;
};

export default RegistrationDetails;
