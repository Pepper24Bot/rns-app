import React, { useEffect, useRef, useState } from "react";
import {
  NotifiContextProvider,
  NotifiCardModal,
} from "@notifi-network/notifi-react";
import {
  Grid,
  Link,
  MenuItem as MuiMenuItem,
  alpha,
  styled,
} from "@mui/material";
import {
  Divider,
  Flex,
  SocialButton,
  Relative,
  SkeletonTypography,
  ToggleButtonGroup as StyledToggleButtonGroup,
  ToggleButton as StyledToggleButton,
  SecondaryLabel,
  ActionTooltip,
  ContentTooltip,
  TitleTooltip,
  FlexJustified,
  ProgressTooltip,
  ToolbarButton,
} from "../Theme/StyledGlobal";
import { useAccount, useEnsName, useSignMessage } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import {
  getMaskedAddress,
  isAccountLoading,
  parseCookie,
  scrollIntoElement,
} from "@/utils/common";
import { Address, fromBytes, toBytes } from "viem";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { DISCORD, DOCS, TWITTER } from "@/constants/url";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "@mui/icons-material";

import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";
import ReactJoyride, { Step } from "react-joyride";
import Image from "next/image";
import MenuPopover from "../Reusables/MenuPopover";
import Account from "./Account";

const ToolbarContainer = styled(Flex)(({ theme }) => ({
  padding: "10px 0",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "center",
  },
}));

const ActionLabel = styled(SecondaryLabel)(({ theme }) => ({
  textTransform: "none",
  fontSize: "15px",
  textAlign: "center",
  fontFamily: "var(--secondary-font)",
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

const ToolbarLabel = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  padding: "11px 0",
  fontSize: "15px",
  width: "max-content",
  color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,

  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const MenuContainer = styled(Grid)(({ theme }) => ({
  minWidth: "150px",
  padding: "16px 0",
}));

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  padding: "4px 16px",
  minHeight: 0,

  "&:last-of-type": {
    borderRadius: "8px",
  },

  "&:hover": {
    backgroundColor: theme.palette.background.darker,
  },
}));

const MenuLabel = styled(ToolbarLabel)(({ theme }) => ({
  fontSize: "14px",
  padding: "2px 4px",
  width: "100%",
  display: "flex",
  alignItems: "center",
}));

const MenuDivider = styled(Divider)(({ theme }) => ({
  margin: "12px 0 !important", // fix the important here - avoid this
}));

export const Toolbar: React.FC = () => {
  const { address: walletAddress, connector, status, chainId } = useAccount();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address, eoaAddress },
  } = useRootNetwork();

  const {
    data: ensName,
    refetch,
    isSuccess: isEnsFetched,
    isLoading: isEnsFetching,
  } = useEnsName({
    address: address as Address,
  });

  const router = useRouter();
  const pathName = usePathname();

  const { toggleModal } = useModalState();
  const { path } = useWalletIcon({ name: connector?.name as Wallet });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<(EventTarget & HTMLElement) | null>(
    null
  );

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [menuAnchor, setMenuAnchor] = useState<
    (EventTarget & HTMLElement) | null
  >(null);

  /**
   * Move wallet label and icon path to useState/useEffect
   * to fix nextjs hydration issue wherein the generated
   * html on the server does not match the rendered html
   * on the client-side
   */
  const [walletLabel, setWalletLabel] = useState<string>("");
  const [iconPath, setIconPath] = useState<string>("/icons/wallet.svg");

  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [run, setRun] = useState<boolean>(true);
  const [steps, setSteps] = useState<Step[]>([]);

  const [openNotifiPanel, setOpenNotifiPanel] = useState<boolean>(false);
  const notifiButtonRef = useRef<HTMLButtonElement>(null);
  const notifiMobileButtonRef = useRef<HTMLButtonElement>(null);
  const [notifiPanelAnchor, setNotifiPanelAnchor] = useState(notifiButtonRef);
  const { signMessageAsync } = useSignMessage();

  const isLabelLoading =
    isAccountLoading(status) ||
    (status !== "disconnected" && isEnsFetching && !isEnsFetched);

  const addressRef = useRef(null);
  const isTutorialDisabled = parseCookie("showTutorial") === "false";

  const handleDashboard = () => {
    setIsMenuOpen(false);
    setMenuAnchor(null);
    if (pathName === "" || pathName === "/identities") {
      scrollIntoElement("My Dashboard-Container");
    } else {
      router.replace(`/identities`, { scroll: false });
    }
  };

  const handleLeaderboard = () => {
    setIsMenuOpen(false);
    setMenuAnchor(null);
    if (pathName.includes("/leaderboard")) {
      scrollIntoElement("Holders-Container");
    } else {
      router.replace(`/leaderboard/top-50`, { scroll: false });
    }
  };

  const handleLinkWindow = (url: string) => {
    setIsMenuOpen(false);
    setMenuAnchor(null);
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const handleCloseNotifiPanel = () => {
    setOpenNotifiPanel(false);
  };

  const handleOpenNotifiPanel = (isMobile = false) => {
    if (!address) {
      toggleModal({
        id: "Wallets",
        title: "Choose your Wallet",
        isXDisabled: true,
      });
    } else {
      setNotifiPanelAnchor(isMobile ? notifiMobileButtonRef : notifiButtonRef);
      setOpenNotifiPanel(true);
    }
  };

  useEffect(() => {
    if (addressRef.current) {
      setSteps([
        {
          target: addressRef.current!,
          disableBeacon: true,
          hideCloseButton: true,
          hideFooter: true,
          spotlightClicks: true,
          content: (
            <Grid>
              <FlexJustified>
                <TitleTooltip>Account Modal</TitleTooltip>
                <TitleTooltip>
                  <ProgressTooltip>1/2</ProgressTooltip>
                </TitleTooltip>
              </FlexJustified>
              <ContentTooltip>
                Click above to view and switch between your EOA and FuturePass
                address.
              </ContentTooltip>
              <ActionTooltip>Click the toolbar above!</ActionTooltip>
            </Grid>
          ),
          styles: {
            options: {
              zIndex: 10000,
            },
          },
        },
      ]);

      setTimeout(() => {
        setRun(true);
      }, 500);
    }
  }, [addressRef.current]);

  useEffect(() => {
    if (hasMounted) {
      let label = "";
      if (status === "connected") {
        // should not be loading and should be successful
        if (!isEnsFetching && isEnsFetched && address) {
          label = ensName || getMaskedAddress(address);
          setWalletLabel(label);
        }
      } else if (status === "disconnected") {
        label = "Connect Wallet";
        setWalletLabel(label);
      }
      const walletIcon = address ? path : "/icons/wallet.svg";
      setIconPath(walletIcon);
    }
  }, [
    address,
    walletAddress,
    ensName,
    isEnsFetched,
    isEnsFetching,
    hasMounted,
  ]);

  useEffect(() => {
    refetch();
  }, [walletAddress, address, chainId]);

  /**
   * This is to fix NextJS hydration.
   * Make sure that the component loaded first,
   * before doing other stuff
   */
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <ToolbarContainer>
      {address && !isTutorialDisabled && (
        <ReactJoyride steps={steps} disableCloseOnEsc run={run} />
      )}
      {/* Desktop Layout */}
      <Flex
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },
        }}
      >
        <ToolbarLabel
          isSelected={pathName === "" || pathName === "/identities"}
          onClick={() => {
            return handleDashboard();
          }}
        >
          My Dashboard
        </ToolbarLabel>
        <Divider orientation="vertical" flexItem />
        <ToolbarLabel
          isSelected={pathName.includes("/leaderboard")}
          onClick={() => {
            return handleLeaderboard();
          }}
        >
          Holders
        </ToolbarLabel>
        <Divider orientation="vertical" flexItem />
        <Link href={DOCS} target="_blank">
          <ToolbarLabel>Docs</ToolbarLabel>
        </Link>
        <Divider orientation="vertical" flexItem />
      </Flex>
      <Flex
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Link href={DISCORD} target="_blank">
          <SocialButton variant="outlined" sx={{ ml: 0 }}>
            <i className="fa-brands fa-discord fa-xl" />
          </SocialButton>
        </Link>
        <Link href={TWITTER} target="_blank">
          <SocialButton variant="outlined">
            <i className="fa-brands fa-x-twitter fa-xl" />
          </SocialButton>
        </Link>
        <SocialButton
          variant="outlined"
          onClick={() => handleOpenNotifiPanel()}
          ref={notifiButtonRef}
        >
          <Image src="/icons/bell.svg" alt="RNS Icon" width={24} height={24} />
        </SocialButton>
        <MenuPopover
          isOpen={openNotifiPanel}
          anchorEl={notifiPanelAnchor.current}
          toggleClose={handleCloseNotifiPanel}
        >
          <div
            style={{
              width: "300px",
            }}
          >
            <NotifiContextProvider
              tenantId="arypdj20udmttckhcpdu"
              env="Production"
              signMessage={async (message: Uint8Array) => {
                const result = await signMessageAsync({
                  message: fromBytes(message, "string"),
                });
                return toBytes(result);
              }}
              walletPublicKey={eoaAddress!}
              walletBlockchain="THE_ROOT_NETWORK"
              cardId="f8d39d0f7f164b038a6ca9d10741c55c"
              inputs={{
                walletAddress: [
                  {
                    label: "",
                    value: eoaAddress,
                  },
                ],
              }}
            >
              <NotifiCardModal />
            </NotifiContextProvider>
          </div>
        </MenuPopover>
        <Divider orientation="vertical" flexItem />
      </Flex>

      {/* Mobile Layout */}
      <Flex
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
        }}
      >
        <ToolbarButton
          variant="contained"
          sx={{ mr: 1 }}
          onClick={(event) => {
            setMenuAnchor(event.currentTarget);
            setIsMenuOpen(!isMenuOpen);
          }}
          ref={notifiMobileButtonRef}
        >
          <Menu />
        </ToolbarButton>
        <MenuPopover
          isOpen={isMenuOpen}
          anchorEl={menuAnchor}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          toggleClose={() => {
            setIsMenuOpen(false);
          }}
        >
          <MenuContainer>
            <MenuItem
              onClick={() => {
                return handleDashboard();
              }}
            >
              <MenuLabel
                isSelected={pathName === "" || pathName === "/identities"}
              >
                My Dashboard
              </MenuLabel>
            </MenuItem>
            <MenuItem
              onClick={() => {
                return handleLeaderboard();
              }}
            >
              <MenuLabel isSelected={pathName.includes("/leaderboard")}>
                Holders
              </MenuLabel>
            </MenuItem>
            <MenuItem
              onClick={() => {
                return handleLinkWindow(DOCS);
              }}
            >
              <MenuLabel>Docs</MenuLabel>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                return handleLinkWindow(TWITTER);
              }}
            >
              <MenuLabel>
                <i
                  className="fa-brands fa-x-twitter fa"
                  style={{ marginRight: "8px" }}
                />
                Twitter
              </MenuLabel>
            </MenuItem>
            <MenuItem
              onClick={() => {
                return handleLinkWindow(DISCORD);
              }}
            >
              <MenuLabel>
                <i
                  className="fa-brands fa-discord fa"
                  style={{ marginRight: "8px" }}
                />
                Discord
              </MenuLabel>
            </MenuItem>
            <MenuItem onClick={() => handleOpenNotifiPanel(true)}>
              <MenuLabel>
                <Image
                  src="/icons/bell.svg"
                  alt="RNS Icon"
                  width={18}
                  height={18}
                  style={{ marginRight: "8px" }}
                />
                Alerts
              </MenuLabel>
            </MenuItem>
          </MenuContainer>
        </MenuPopover>
      </Flex>

      {/* TODO: Clean this */}
      <Grid textAlign="center">
        <ToggleButtonGroup ref={addressRef}>
          <ToggleButton
            value=""
            onClick={() => {
              if (address) {
                toggleModal({
                  id: "Wallets",
                  title: address ? "Switch Wallet" : "Choose your Wallet",
                  isXDisabled: true,
                });
              }
            }}
          >
            <Image
              src={iconPath}
              alt="Wallet Icon"
              width={24}
              height={24}
              style={{ color: "white" }}
            />
          </ToggleButton>
          <ToggleButton
            value=""
            onClick={(event) => {
              if (!address && hasMounted) {
                toggleModal({
                  id: "Wallets",
                  title: address ? "Switch Wallet" : "Choose your Wallet",
                  isXDisabled: true,
                });
              }
              if (address && hasMounted) {
                setIsOpen(!isOpen);
                setAnchor(event.currentTarget);
              }
              setRun(false);
            }}
          >
            <Relative minWidth={140}>
              <SkeletonTypography
                isloading={isLabelLoading || !hasMounted}
                sx={{ bgcolor: "primary.light" }}
              />
              <ActionLabel isloading={isLabelLoading || !hasMounted}>
                {walletLabel || "Connect Wallet"}
              </ActionLabel>
            </Relative>
          </ToggleButton>
        </ToggleButtonGroup>
        <Grid>
          <MenuPopover
            isOpen={isOpen}
            anchorEl={anchor}
            toggleClose={() => {
              setIsOpen(false);
            }}
          >
            {address && (
              <Grid p={3} minWidth={250}>
                <Account
                  toggleClose={() => {
                    setIsOpen(false);
                  }}
                />
              </Grid>
            )}
          </MenuPopover>
        </Grid>
      </Grid>
    </ToolbarContainer>
  );
};

export default Toolbar;
