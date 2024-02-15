import React from "react";
import { Close } from "@mui/icons-material";
import { styled, alpha, Typography, IconButton } from "@mui/material";
import { Flex, FlexJustified } from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";

import Image from "next/image";

const Header = styled(FlexJustified)(({ theme }) => ({
  borderRadius: "8px 8px 0 0",
  backgroundColor: alpha(theme.palette.primary.dark, 0.25),
  padding: "20px 25px 20px 50px",
}));

const CloseIcon = styled(Close)(({ theme }) => ({
  color: alpha(theme.palette.primary.contrastText, 0.5),

  "&:hover": {
    color: alpha(theme.palette.primary.contrastText, 0.75),
    cursor: "pointer",
  },
}));

export const ModalHeader: React.FC = () => {
  const { closeModal, useModal } = useModalState();
  const { props } = useModal();

  return (
    <Header>
      <Flex>
        <Image
          src="/images/rns-2.svg"
          alt="RNS Icon"
          width={46}
          height={20}
          style={{ opacity: 0.5, margin: "4px 10px 0 0" }}
        />
        <Typography>{props?.title}</Typography>
      </Flex>
      <IconButton
        onClick={() => {
          return closeModal();
        }}
      >
        <CloseIcon />
      </IconButton>
    </Header>
  );
};

export default ModalHeader;
