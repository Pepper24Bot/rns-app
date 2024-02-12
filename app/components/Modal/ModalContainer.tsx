import React from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import {
  Dialog as MuiDialog,
  Grid,
  styled,
  alpha,
  IconButton,
} from "@mui/material";
import { FlexCenter } from "../Theme/StyledGlobal";
import { Close } from "@mui/icons-material";
import Paragraph from "../Reusables/Paragraph";

const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "8px",
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.primary.main,
      0.1
    )})`,
  },
}));

const DialogContainer = styled(FlexCenter)(({ theme }) => ({
  maxWidth: "670px",
  background: "linear-gradient(180deg, #000000 32.5%, #c2185b 100%)",
}));

const Title = styled(Grid)(({ theme }) => ({
  fontFamily: "Roboto Mono",
  fontSize: "24px",
  fontWeight: 700,
  textAlign: "center",
  marginBottom: "15px",
}));

const Content = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  padding: "50px 45px 40px 45px",
  margin: "1px",
  borderRadius: "8px",
}));

const CloseIcon = styled(Close)(({ theme }) => ({
  position: "absolute",
  right: 25,
  top: 25,
  color: alpha(theme.palette.primary.contrastText, 0.5),

  "&:hover": {
    color: alpha(theme.palette.primary.contrastText, 0.75),
    cursor: "pointer",
  },
}));

export const ModalContainer: React.FC = () => {
  const { useModal, closeModal } = useModalState();
  const { isModalOpen, props } = useModal();

  return (
    <Dialog open={isModalOpen} onClose={closeModal}>
      <DialogContainer>
        <Content>
          <CloseIcon
            onClick={() => {
              closeModal();
            }}
          />
          <Title>{props?.title}</Title>
          {props?.description && <Paragraph description={props?.description} />}
          {props?.node}
        </Content>
      </DialogContainer>
    </Dialog>
  );
};

export default ModalContainer;
