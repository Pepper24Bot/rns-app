"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount } from "wagmi";

export default function Page({ params }: { params: { slug: string } }) {
  const pathname = usePathname();

  const { address } = useAccount();
  const { toggleModal } = useModalState();

  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const name = pathname.split("/")[1];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (name && address && hasMounted) {
      toggleModal({
        id: "Registration Details",
        title: "Registration Details",
        data: {
          name,
        },
      });
    }
  }, [name, address, hasMounted]);

  return <></>;
}
