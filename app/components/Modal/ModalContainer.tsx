import React from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import {
  Dialog as MuiDialog,
  Grid,
  styled,
  alpha,
  IconButton,
  Link,
} from "@mui/material";
import { FlexCenter, FlexJustified } from "../Theme/StyledGlobal";
import { Close } from "@mui/icons-material";
import Paragraph from "../Reusables/Paragraph";

const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    maxWidth: "900px",
    borderRadius: "8px",
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.primary.main,
      0.1
    )})`,
  },
}));

const DialogContainer = styled(FlexCenter)(({ theme }) => ({
  maxWidth: "900px",
  background: "linear-gradient(180deg, #000000 32.5%, #c2185b 100%)",
}));

const Title = styled(Grid)(({ theme }) => ({
  fontFamily: "Roboto Mono",
  fontSize: "24px",
  fontWeight: 700,
  textAlign: "center",
  marginBottom: "20px",
}));

const ContentContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  margin: "1px",
  borderRadius: "8px",
}));

const Content = styled(Grid)(({ theme }) => ({
  padding: "0px 45px 0px 45px",
}));

const DownloadButton = styled(Link)(({ theme }) => ({
  border: "none",
  color: theme.palette.primary.main,

  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 25,
  top: 25,
}));

const CloseIcon = styled(Close)(({ theme }) => ({
  color: alpha(theme.palette.primary.contrastText, 0.5),

  "&:hover": {
    color: alpha(theme.palette.primary.contrastText, 0.75),
    cursor: "pointer",
  },
}));

const Footer = styled(FlexJustified)(({ theme }) => ({
  borderTop: `solid 1px ${alpha(theme.palette.primary.dark, 0.75)}`,
  padding: "24px 50px",
}));

export const ModalContainer: React.FC = () => {
  const { useModal, closeModal } = useModalState();
  const { isModalOpen, props } = useModal();

  const isCloseDisabled = props?.isCloseDisabled || false;

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => {
        if (isCloseDisabled) {
          // do not allow modal to be closed
        } else {
          return closeModal();
        }
      }}
      disableEscapeKeyDown={isCloseDisabled}
    >
      <DialogContainer>
        <ContentContainer>
          {props?.header}
          {/* TODO: Move the styling to styledcomponents */}
          <Content
            sx={{
              paddingTop: props?.header ? "0px" : "50px",
              paddingBottom: props?.header ? "10px" : "40px",
            }}
          >
            {!props?.isXDisabled && (
              <CloseButton>
                <CloseIcon
                  onClick={() => {
                    return closeModal();
                  }}
                />
              </CloseButton>
            )}
            <Title>{props?.title}</Title>
            {props?.description && (
              <Paragraph description={props?.description} />
            )}
            {props?.node}
          </Content>
          {props?.isFooterEnabled && (
            <Footer>
              {props?.downloadFile && (
                <DownloadButton href={props?.downloadFile} download>
                  <i
                    className="fa-solid fa-file-pdf"
                    style={{ color: "#c2185b", marginRight: "8px" }}
                  />
                  Download
                </DownloadButton>
              )}
            </Footer>
          )}
        </ContentContainer>
      </DialogContainer>
    </Dialog>
  );
};

export default ModalContainer;
