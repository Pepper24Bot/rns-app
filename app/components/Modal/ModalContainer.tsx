import React, { useEffect, useState } from "react";
import { useModalState } from "@/redux/modal/modalSlice";
import {
  Dialog as MuiDialog,
  Grid,
  styled,
  alpha,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import { FlexCenter, FlexJustified, Title } from "../Theme/StyledGlobal";
import { Close } from "@mui/icons-material";
import { PolicyAndTerms } from "../Reusables/PolicyAndTerms";
import { useSearchParams } from "next/navigation";
import { getModal } from "@/services/utils";

import Paragraph from "../Reusables/Paragraph";
import ModalHeader from "./ModalHeader";
import Wallets from "../Wallet/Wallets";
import SwitchNetwork from "../Wallet/SwitchNetwork";
import Registration from "../Registration/Registration";
import RegistrationDetails from "../Registration/Details";
import Expiry from "../Expiry/Expiry";
import Link from "../Link/Link";
import ShareRegistration from "../Share/ShareRegistration";

interface ContentProps {
  fullWidth?: boolean;
  fullHeight?: boolean;
  isHeaderEnabled?: boolean;
}

const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    maxWidth: "max-content",
    maxHeight: "max-content",
    borderRadius: "8px",
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.primary.main,
      0.1
    )})`,

    [theme.breakpoints.down("sm")]: {
      margin: "16px",
    },
  },
}));

const DialogContainer = styled(FlexCenter)(({ theme }) => ({
  background: "linear-gradient(180deg, #000000 32.5%, #c2185b 100%)",
}));

const ContentContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  margin: "1px",
  borderRadius: "8px",
}));

const Content = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "props",
})<{ props?: ContentProps }>(({ props, theme }) => ({
  paddingTop: props?.isHeaderEnabled ? "10px" : props?.fullHeight ? 0 : "50px",
  paddingBottom: props?.isHeaderEnabled
    ? "10px"
    : props?.fullHeight
    ? 0
    : "40px",
  paddingLeft: props?.fullWidth ? 0 : "45px",
  paddingRight: props?.fullWidth ? 0 : "45px",

  [theme.breakpoints.down("sm")]: {
    // TODO: Clean this up
    paddingTop: props?.fullHeight ? 0 : "40px",
    paddingBottom: props?.fullHeight ? 0 : "40px",
    paddingLeft: props?.fullWidth ? 0 : "20px",
    paddingRight: props?.fullWidth ? 0 : "20px",
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

  const [hasPathModal, setHasPathModal] = useState(false);
  const [isFullSize, setIsFullSize] = useState(false);

  const params = useSearchParams();

  const modalProps = getModal(params.get("state") || "");
  const isCloseDisabled = props?.isCloseDisabled || false;
  const type = props?.id || modalProps.modalType || "";

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
      case "Extend Expiry":
        return <Expiry {...props?.data} />;
      case "Link Name":
        return <Link {...props?.data} />;
      case "Share RNS":
        return <ShareRegistration />;
      default:
        return;
    }
  };

  useEffect(() => {
    setHasPathModal(modalProps.isModalOpen);

    // TODO: This is very specific to share twitter - PLS FIX!!!
    const fullSize =
      modalProps.isModalOpen && modalProps.modalType === "Share RNS";
    setIsFullSize(fullSize);
  }, []);

  return (
    <Dialog
      open={isModalOpen || hasPathModal}
      onClose={() => {
        if (isCloseDisabled) {
          // do not allow modal to be closed
        } else {
          closeModal();
          setHasPathModal(false);
          setIsFullSize(false);
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
              fullHeight: props?.fullHeight || isFullSize,
              fullWidth: props?.fullWidth || isFullSize,
              isHeaderEnabled: props?.isHeaderEnabled,
            }}
          >
            {!props?.isXDisabled && (
              <CloseButton
                onClick={() => {
                  closeModal();
                  setHasPathModal(false);
                  setIsFullSize(false);
                }}
              >
                <CloseIcon />
              </CloseButton>
            )}
            {!props?.isHeaderEnabled && props?.title && (
              <Title>{props?.title}</Title>
            )}
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
  );
};

export default ModalContainer;
