import React, { useState } from "react";
import { ModalState, useModalState } from "@/redux/modal/modalSlice";
import {
  Dialog as MuiDialog,
  Grid,
  styled,
  alpha,
  IconButton,
  Link as MuiLink,
  darken,
} from "@mui/material";
import { FlexCenter, FlexJustified, Title } from "../Theme/StyledGlobal";
import { Close } from "@mui/icons-material";
import { PolicyAndTerms } from "../Reusables/PolicyAndTerms";
import { useSearchParams } from "next/navigation";
import { getModalFromPath } from "@/services/utils";

import Paragraph from "../Reusables/Paragraph";
import ModalHeader from "./ModalHeader";
import Wallets from "../Wallet/Wallets";
import SwitchNetwork from "../Wallet/SwitchNetwork";
import Registration from "../Registration/Registration";
import RegistrationDetails from "../Registration/Details";
import Expiry from "../Expiry/Expiry";
import LinkAddress from "../LinkAddress/LinkAddress";
import ShareRegistration from "../Share/ShareRegistration";
import RegistrationProcess from "../Registration/Process";
import Primary from "../Primary/Primary";

interface ContentProps {
  fullWidth?: boolean;
  fullHeight?: boolean;
  isHeaderEnabled?: boolean;
}

const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    filter: `drop-shadow(0px 10px 15px ${alpha(
      theme.palette.primary.main,
      0.15
    )})`,
    maxWidth: "max-content",
    maxHeight: "max-content",
    borderRadius: "8px",

    [theme.breakpoints.down("sm")]: {
      margin: "16px",
    },
  },
}));

const Shadow = styled(FlexCenter)(({ theme }) => ({}));

const DialogContainer = styled(FlexCenter)(({ theme }) => ({
  background: "linear-gradient(180deg, #000000 32.5%, #c2185b 100%)",
}));

const ContentContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: darken(theme.palette.background.darker, 0.6),
  margin: "1px",
  borderRadius: "8px",
}));

const Content = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "props",
})<{ props?: ContentProps }>(({ props, theme }) => ({
  paddingTop: props?.isHeaderEnabled ? "10px" : props?.fullHeight ? 0 : "35px",
  paddingBottom: props?.isHeaderEnabled
    ? "10px"
    : props?.fullHeight
    ? 0
    : "25px",
  paddingLeft: props?.fullWidth ? 0 : "30px",
  paddingRight: props?.fullWidth ? 0 : "30px",

  [theme.breakpoints.down("sm")]: {
    // TODO: Clean this up
    paddingTop: props?.fullHeight ? 0 : "20px",
    paddingBottom: props?.fullHeight ? 0 : "20px",
    paddingLeft: props?.fullWidth ? 0 : "15px",
    paddingRight: props?.fullWidth ? 0 : "15px",
  },
}));

const DownloadButton = styled(MuiLink)(({ theme }) => ({
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
  zIndex: 2,

  [theme.breakpoints.down("sm")]: {
    right: 10,
    top: 10,
  },
}));

const CloseIcon = styled(Close)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.5),

  "&:hover": {
    color: alpha(theme.palette.text.primary, 0.75),
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

  const params = useSearchParams();
  const state = params.get("state") || "";
  const modal: ModalState = getModalFromPath(state, props?.id);

  const [isPathModalOpen, setIsPathModalOpen] = useState(modal.isModalOpen);

  const isCloseDisabled = props?.isCloseDisabled || false;
  const type = props?.id || modal.props?.id || "";
  const isFullHeight = props?.fullHeight || modal.props?.fullHeight;
  const isFullWidth = props?.fullWidth || modal.props?.fullWidth;
  const isOpen = isModalOpen || isPathModalOpen;
  const title = props?.title || modal.props?.title;

  /**
   * Storing a non-serializeable (e.g, react components)
   * in redux is not recommended, So instead of passing the components
   * thru RTK Query, create a switch here to get the needed components.
   *
   * "reduxy way :("
   */
  const getContent = (type: string) => {
    switch (type) {
      case "Policy":
        return <PolicyAndTerms type="Policy" />;
      case "Terms":
        return <PolicyAndTerms type="Terms" />;
      case "Wallets":
        return <Wallets />;
      case "Switch Network":
        return <SwitchNetwork />;
      case "Register Name":
        return <Registration />;
      case "Registration Details":
        return <RegistrationDetails />;
      case "Registration Info":
        return <RegistrationProcess />;
      case "Extend Expiry":
        return <Expiry {...props?.data} />;
      case "Link Identity":
        return <LinkAddress {...props?.data} />;
      case "Share RNS":
        return <ShareRegistration />;
      case "Set as Primary":
        return <Primary {...props?.data} />;
      default:
        return;
    }
  };

  return (
    <>
      <Shadow id="shadow-id" />
      <Dialog
        open={isOpen}
        onClose={() => {
          if (isCloseDisabled) {
            // do not allow modal to be closed
          } else {
            closeModal();
            setIsPathModalOpen(false);
          }
        }}
        disableEscapeKeyDown={isCloseDisabled}
      >
        <DialogContainer>
          <ContentContainer>
            {props?.isHeaderEnabled && <ModalHeader />}
            {/* TODO: Move the styling to styledcomponents */}
            <Content
              props={{
                fullHeight: isFullHeight,
                fullWidth: isFullWidth,
                isHeaderEnabled: props?.isHeaderEnabled,
              }}
            >
              {!props?.isXDisabled && (
                <CloseButton
                  onClick={() => {
                    closeModal();
                    setIsPathModalOpen(false);
                    console.log("closing...");
                  }}
                >
                  <CloseIcon />
                </CloseButton>
              )}
              {!props?.isHeaderEnabled && title && <Title>{title}</Title>}
              {props?.description && (
                <Paragraph description={props?.description} />
              )}
              {getContent(type)}
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
    </>
  );
};

export default ModalContainer;
