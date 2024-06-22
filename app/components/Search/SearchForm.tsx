"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  InputAdornment,
  styled,
  Collapse,
  ClickAwayListener,
  IconButton,
} from "@mui/material";
import { FlexCenter } from "../Theme/StyledGlobal";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { debounce as _debounce, isEmpty } from "lodash";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { SearchPopper } from "./SearchPopper";
import { isNameSupported } from "@/utils/common";
import { normalize } from "viem/ens";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import {
  Search,
  Container,
  SearchContainer,
  SearchTitle,
  SearchSubText,
  SearchField,
  SearchIcon,
  ViewContainer,
  ViewRnsText,
  ConnectButton,
  Divider,
} from "./StyledSearch";
import { EmojiEmotions } from "@mui/icons-material";

import Image from "next/image";
import useWrappedData from "@/hooks/useWrappedData";
import useAllNamesForAddress from "@/hooks/useAllNamesForAddress";
import EmojiPopper from "./EmojiPopper";

const NextImage = styled(Image)(({ theme }) => ({
  marginRight: "8px",
  color: "white",
}));

export const SearchForm: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isNameInvalid, setIsNameInvalid] = useState<boolean>(false);
  const [isNameNotSupported, setIsNameNotSupported] = useState<boolean>(false);

  const { status } = useAccount();
  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();

  const {
    data: { address },
  } = useRootNetwork();

  const { name: wrappedName, isLoading } = useWrappedData({
    name: `${searchValue}.root`,
    skip: !searchValue,
  });

  const { names, isFetching } = useAllNamesForAddress({
    skip: !searchValue || !wrappedName?.owner,
    filter: {
      name: `${searchValue}.root`,
      address: wrappedName?.owner ?? "0x",
    },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEmoji, setAnchorEmoji] = useState<null | HTMLElement>(null);

  const searchFieldRef = useRef(null);

  const getNameStatus = () => {
    const item = names && names[0];
    const isAvailable = isEmpty(wrappedName);
    const isNotAvailable =
      !isEmpty(item) && item && item.wrappedOwner !== address;

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
    if (anchorEmoji === null) {
      setAnchorEl(null);
    }
    setAnchorEmoji(null);
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
                            setAnchorEmoji(searchFieldRef.current);
                          }}
                        >
                          <EmojiEmotions />
                        </IconButton>
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
                <EmojiPopper
                  anchorEl={anchorEmoji}
                  value={inputValue}
                  debounceFn={(value) => {
                    debounceFn(value);
                  }}
                  setValue={(value) => {
                    setInputValue(value);
                  }}
                />
                <SearchPopper
                  isLoading={isFetching || isLoading}
                  anchorEl={anchorEl}
                  searchValue={searchValue}
                  status={getNameStatus()}
                  isNameInvalid={isNameInvalid}
                  isNameNotSupported={isNameNotSupported}
                  data={names && names[0]}
                />
              </FlexCenter>
            </ClickAwayListener>
          </Search>
        </SearchContainer>
      </FlexCenter>
      <Collapse in={status === "disconnected"}>
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
