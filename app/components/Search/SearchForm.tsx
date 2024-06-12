"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Divider as MuiDivider,
  Grid,
  InputAdornment,
  alpha,
  styled,
  Collapse,
  ClickAwayListener,
  IconButton,
} from "@mui/material";
import {
  ActionButton,
  FlexCenter,
  BaseInputField,
  SubTitle,
  Title,
} from "../Theme/StyledGlobal";
import { Search as MuiSearchIcon } from "@mui/icons-material";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { debounce as _debounce, isEmpty } from "lodash";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { SearchPopper } from "./SearchPopper";
import { FONT_SIZE, FONT_WEIGHT } from "../Theme/Global";
import { isAccountLoading, isNameSupported } from "@/utils/common";
import { useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { normalize } from "viem/ens";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";

import Image from "next/image";

const Container = styled(Grid)(({ theme }) => ({
  padding: "60px 10px 130px 10px",

  [theme.breakpoints.down("sm")]: {
    padding: "80px 10px 75px 10px",
  },
}));

const SearchContainer = styled(Grid)(({ theme }) => ({
  background: `linear-gradient(0deg, ${
    theme.palette.background.paper
  } 20%, ${alpha(theme.palette.primary.main, 0.5)} 100%)`,

  // TODO: theme.palette.primary.main -- fix this
  boxShadow: `0px 0px 30px 0px rgba(194,24,91,0.25)`,
  position: "relative",
  width: "100%",
  maxWidth: "800px",
  borderRadius: "16px",

  "&::before": {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80%",
    content: '""',
    background: "linear-gradient(transparent 0%,#000000 100%)",
    boxShadow: `0px 50px 30px 25px rgba(0,0,0)`,
    borderRadius: "16px",
  },
}));

const Search = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: "75px 45px",
  margin: "1px",
  borderRadius: "16px",

  position: "relative",
  zIndex: 2,

  [theme.breakpoints.down("lg")]: {
    padding: "40px 20px",
  },
}));

const ViewContainer = styled(Grid)(({ theme }) => ({
  textAlign: "center",
  padding: "50px 0",
}));

const SearchTitle = styled(Title)(({ theme }) => ({
  fontSize: "48px",

  [theme.breakpoints.down("lg")]: {
    fontSize: FONT_SIZE.Xxlarge,
  },
}));

const SearchField = styled(BaseInputField)(({ theme }) => ({
  marginTop: "50px",
  maxWidth: "500px",
}));

const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

const SearchSubText = styled(SubTitle)(({ theme }) => ({
  fontSize: "18px",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Medium,
  },
}));

const ViewRnsText = styled(SubTitle)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  marginTop: "80px",
}));

const ConnectButton = styled(ActionButton)(({ theme }) => ({
  fontFamily: "var(--default-font)",
  textTransform: "uppercase",
  color: theme.palette.text.primary,

  "&.MuiButtonBase-root": {
    padding: "8px 24px",
    borderRadius: "16px",
  },
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  width: "65vmin",
  borderColor: "rgba(184,167,174,0.1)",
  filter: `drop-shadow(0px 0px 5px ${alpha(theme.palette.primary.main, 0.15)})`,
}));

const NextImage = styled(Image)(({ theme }) => ({
  marginRight: "8px",
  color: "white",
}));

export const SearchForm: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isViewRnsVisible, setIsViewRnsVisible] = useState<boolean>(false);
  const [isNameInvalid, setIsNameInvalid] = useState<boolean>(false);
  const [isNameNotSupported, setIsNameNotSupported] = useState<boolean>(false);

  const { status } = useAccount();
  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();

  const {
    data: { address },
  } = useRootNetwork();

  const { data, isLoading } = useGetNamesByNameQuery(
    { labelName: `${searchValue}` },
    { skip: searchValue === null || isNameInvalid }
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const searchFieldRef = React.useRef(null);

  const getNameStatus = () => {
    const isAvailable = isEmpty(data?.wrappedDomains);

    const isNotAvailable =
      !isEmpty(data?.wrappedDomains) &&
      data?.wrappedDomains[0].owner.id !== address?.toLowerCase();

    return isNameInvalid
      ? "Invalid"
      : isNameNotSupported
      ? "Not Supported"
      : isAvailable
      ? "Available"
      : isNotAvailable
      ? "Not Available"
      : "Registered";
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDebounceOnChange = (value: string) => {
    setAnchorEl(searchFieldRef.current);

    const supported = isNameSupported(value);
    setIsNameNotSupported(!supported);

    try {
      const normalized = normalize(value);
      setIsNameInvalid(false);
      setSearchValue(normalized);
    } catch (error) {
      setIsNameInvalid(true);
      setSearchValue(value);
    }
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  useEffect(() => {
    setIsViewRnsVisible(status === "disconnected");
  }, [status]);

  return (
    <Container>
      <FlexCenter>
        <SearchContainer>
          <Search>
            <SearchTitle>Name Search</SearchTitle>
            <SearchSubText>
              Your premier cross platform, data, social and wallet identity on
              The Root Network. Take your identity and data wherever you go.
            </SearchSubText>
            <ClickAwayListener
              onClickAway={() => {
                handleClose();
              }}
            >
              <FlexCenter>
                <SearchField
                  ref={searchFieldRef}
                  variant="outlined"
                  placeholder="Search..."
                  fullWidth
                  value={inputValue}
                  onChange={(event) => {
                    const { value } = event.target;
                    setInputValue(value);
                    debounceFn(value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setAnchorEl(searchFieldRef.current);
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <SearchPopper
                  isLoading={isLoading}
                  anchorEl={anchorEl}
                  searchValue={searchValue}
                  status={getNameStatus()}
                  isNameInvalid={isNameInvalid}
                  isNameNotSupported={isNameNotSupported}
                  data={data?.wrappedDomains[0]}
                />
              </FlexCenter>
            </ClickAwayListener>
          </Search>
        </SearchContainer>
      </FlexCenter>
      <Collapse in={isViewRnsVisible}>
        <FlexCenter>
          <ViewContainer>
            <Divider orientation="horizontal" variant="fullWidth" />
            <ViewRnsText>View your Dashboard</ViewRnsText>
            <ConnectButton
              variant="outlined"
              onClick={() => {
                toggleModal({
                  id: "Wallets",
                  isXDisabled: true,
                  title: address ? "Switch Wallet" : "Choose your Wallet",
                });
              }}
            >
              <NextImage
                src="/icons/wallet.svg"
                alt="Wallet Icon"
                width={24}
                height={24}
              />
              Connect Your Wallet
            </ConnectButton>
          </ViewContainer>
        </FlexCenter>
      </Collapse>
    </Container>
  );
};

export default SearchForm;
