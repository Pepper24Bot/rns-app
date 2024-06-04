"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount } from "wagmi";

import MainPage from "@/components/Main/MainPage";

export default function RegistrationDetails() {
  console.log("name===========");
  const pathname = usePathname();

  const { address } = useAccount();
  const { toggleModal } = useModalState();

  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const name = pathname.split("/details/")[1];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    console.log("name:: ", name);
    console.log("address:: ", address);
    console.log("hasMounted:: ", hasMounted);

    if (name && address && hasMounted) {
      console.log("toggle...");
      toggleModal({
        id: "Registration Details",
        title: "Registration Details",
        data: {
          name,
        },
      });
    }
  }, [name, address, hasMounted]);

  return <MainPage />;
}
