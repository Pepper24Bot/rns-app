import React, { useEffect, useState } from "react";
import { Grid, Link, alpha, styled } from "@mui/material";
import {
  Divider,
  Flex,
  SocialButton,
  Relative,
  SkeletonTypography,
  ToggleButtonGroup as StyledToggleButtonGroup,
  ToggleButton as StyledToggleButton,
} from "../Theme/StyledGlobal";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress, isAccountLoading } from "@/services/utils";
import { useGetPrimaryNameResolverQuery } from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";

import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";
import Image from "next/image";
import MenuPopover from "../Reusables/MenuPopover";
import Account from "./Account";
import usePrimary from "@/hooks/usePrimary";

const ToolbarContainer = styled(Flex)(({ theme }) => ({
  padding: "10px 0",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "center",
  },
}));

const HorizontalDivider = styled(Divider)(({ theme }) => ({
  margin: "8px 0 16px 0",
  [theme.breakpoints.up("mobile")]: {
    display: "none",
  },
}));

const ActionLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "isLoading",
})<{ isLoading?: boolean }>(({ theme, isLoading }) => ({
  visibility: isLoading ? "hidden" : "visible",
  textTransform: "none",
}));

const ToggleButtonGroup = styled(StyledToggleButtonGroup)(({ theme }) => ({
  borderRadius: "16px",
  minWidth: 0,
}));

const ToggleButton = styled(StyledToggleButton)(({ theme }) => ({
  width: "auto",
  height: "auto",
  padding: "8px 16px",
  borderRadius: "16px",
  backgroundColor: alpha(theme.palette.primary.main, 0.85),

  "&.MuiToggleButton-root": {
    color: theme.palette.text.primary,
  },
}));

export const Toolbar: React.FC = () => {
  const { address, connector, status } = useAccount();
  const { toggleModal } = useModalState();
  const { path } = useWalletIcon({ name: connector?.name as Wallet });
  const { getPrimaryName } = usePrimary();

  const { data: primaryData, isLoading: primaryListLoading } =
    useGetPrimaryNameResolverQuery(
      { id: address?.toLowerCase() || "" },
      { skip: address === null }
    );

  const [ensName, setEnsName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<(EventTarget & HTMLElement) | null>(
    null
  );

  /**
   * Move wallet label and icon path to useState/useEffect
   * to fix nextjs hydration issue wherein the generated
   * html on the server does not match the rendered html
   * on the client-side
   */
  const [walletLabel, setWalletLabel] = useState<string>("Connect Wallet");
  const [iconPath, setIconPath] = useState<string>("/icons/wallet.svg");

  const isLabelLoading = isAccountLoading(status);

  const getName = async () => {
    if (!isEmpty(primaryData?.nameWrappeds)) {
      const domains = primaryData?.nameWrappeds[0].owner.domains;

      if (!isEmpty(domains) && domains) {
        const id = domains[0].id;
        const { data } = await getPrimaryName({ domainId: id });
        setEnsName(data);
      }
    }
  };

  useEffect(() => {
    /** TODO: Fix this after data invalidation  */
    getName();
  }, [primaryData, primaryListLoading]);

  useEffect(() => {
    // TODO: display ensName here of the connected address
    const label = ensName
      ? ensName
      : address
      ? getMaskedAddress(address)
      : "Connect Wallet";
    setWalletLabel(label);

    const walletIcon = address ? path : "/icons/wallet.svg";
    setIconPath(walletIcon);
  }, [address, ensName]);

  return (
    <ToolbarContainer>
      <Flex
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Link href="https://twitter.com/RootNameService" target="_blank">
          <SocialButton variant="outlined">
            <i className="fa-brands fa-discord fa-xl" />
          </SocialButton>
        </Link>
        <Link href="https://twitter.com/RootNameService" target="_blank">
          <SocialButton variant="outlined">
            <i className="fa-brands fa-x-twitter fa-xl" />
          </SocialButton>
        </Link>
        <Divider orientation="vertical" flexItem />
      </Flex>

      {/* TODO: Clean this */}
      <Grid width="100%" textAlign="center">
        <HorizontalDivider variant="fullWidth" />
        <ToggleButtonGroup>
          <ToggleButton
            value=""
            onClick={() => {
              toggleModal({
                id: "Wallets",
                title: address ? "Switch Wallet" : "Choose your Wallet",
                isXDisabled: true,
              });
            }}
          >
            <Image
              src={iconPath}
              alt="Wallet Icon"
              width={24}
              height={24}
              style={{ color: "white", marginRight: address ? "" : "8px" }}
            />
            {!address && (
              <Relative>
                <SkeletonTypography
                  isloading={isLabelLoading}
                  sx={{ bgcolor: "primary.light" }}
                />
                <ActionLabel isLoading={isLabelLoading}>
                  {walletLabel}
                </ActionLabel>
              </Relative>
            )}
          </ToggleButton>
          {address && (
            <ToggleButton
              value=""
              onClick={(event) => {
                setIsOpen(!isOpen);
                setAnchor(event.currentTarget);
              }}
            >
              <Relative>
                <SkeletonTypography
                  isloading={isLabelLoading}
                  sx={{ bgcolor: "primary.light" }}
                />
                <ActionLabel isLoading={isLabelLoading}>
                  {walletLabel}
                </ActionLabel>
              </Relative>
            </ToggleButton>
          )}
        </ToggleButtonGroup>
        <MenuPopover
          isOpen={isOpen}
          anchorEl={anchor}
          toggleClose={() => {
            setIsOpen(false);
          }}
        >
          {address && (
            <Account
              toggleClose={() => {
                setIsOpen(false);
              }}
            />
          )}
        </MenuPopover>
      </Grid>
    </ToolbarContainer>
  );
};

export default Toolbar;
