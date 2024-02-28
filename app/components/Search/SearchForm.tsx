import React, { useCallback, useEffect, useState } from "react";
import {
  Divider as MuiDivider,
  Grid,
  InputAdornment,
  alpha,
  styled,
  Collapse,
} from "@mui/material";
import {
  ActionButton,
  FlexCenter,
  BaseInputField,
  SubTitle,
  Title,
} from "../Theme/StyledGlobal";
import { Search as MuiSearchIcon } from "@mui/icons-material";
import { DEFAULT_DEBOUNCE } from "@/services/constants";
import { debounce as _debounce, isEmpty } from "lodash";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { useGetNamesQuery } from "@/redux/graphql/hooks";

import Image from "next/image";

const Container = styled(Grid)(({ theme }) => ({
  margin: "50px 0 120px 0",
}));

const SearchContainer = styled(Grid)(({ theme }) => ({
  background: `linear-gradient(0deg, ${
    theme.palette.background.paper
  } 20%, ${alpha(theme.palette.primary.main, 0.5)} 100%)`,

  // TODO: theme.palette.primary.main -- fix this
  boxShadow: `0px 0px 20px 0px rgba(194,24,91,0.25)`,
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
    transform: "scale(1.2)",
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
}));

const ViewContainer = styled(Grid)(({ theme }) => ({
  textAlign: "center",
  padding: "50px 0",
}));

const SearchTitle = styled(Title)(({ theme }) => ({
  fontSize: "48px",
}));

const SearchField = styled(BaseInputField)(({ theme }) => ({
  marginTop: "50px",
  maxWidth: "500px",
}));

const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

const SearchSubText = styled(SubTitle)(({ theme }) => ({}));

const ViewRnsText = styled(SubTitle)(({ theme }) => ({
  fontWeight: 400,
  marginTop: "80px",
}));

const ConnectButton = styled(ActionButton)(({ theme }) => ({
  fontFamily: "var(--default-font)",
  textTransform: "uppercase",
  color: theme.palette.primary.contrastText,

  "&.MuiButtonBase-root": {
    padding: "8px 24px",
    borderRadius: "16px",
  },
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  width: "65vh",
  borderColor: "rgba(184,167,174,0.15)",
  filter: `drop-shadow(0px 0px 5px ${alpha(theme.palette.primary.main, 0.15)})`,
}));

export const SearchForm: React.FC = () => {
  const { address } = useAccount();
  const { toggleModal } = useModalState();

  const { data, isLoading } = useGetNamesQuery({});

  const [searchValue, setSearchValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isViewRnsVisible, setIsViewRnsVisible] = useState<boolean>(false);

  /**
   * TODO:
   * Use RTK Query
   * This is an API call -- pending
   *
   * Should call api and search for the name inputted
   * @param value
   */
  const handleDebounceOnChange = (value: string) => {
    console.log("debounce value:: ", value);
    setSearchValue(value);
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  useEffect(() => {
    setIsViewRnsVisible(isEmpty(address));
  }, [address]);

  useEffect(() => {
    console.log("data:: ", data);
  }, [data]);

  return (
    <Container>
      <FlexCenter>
        <SearchContainer>
          <Search>
            <SearchTitle>Name Search</SearchTitle>
            <SearchSubText>
              Your official cross platform, data, social and wallet identity on
              The Root Network. Take your identity and data wherever you go.
            </SearchSubText>
            <FlexCenter>
              <SearchField
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
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FlexCenter>
          </Search>
        </SearchContainer>
      </FlexCenter>
      <Collapse in={isViewRnsVisible}>
        <FlexCenter>
          <ViewContainer>
            <Divider orientation="horizontal" variant="fullWidth" />
            <ViewRnsText>View your registered RNS?</ViewRnsText>
            <ConnectButton
              variant="outlined"
              onClick={() => {
                toggleModal({
                  id: "Wallets",
                  title: address ? "Switch Wallet" : "Choose your Wallet",
                });
              }}
            >
              <Image
                src="/icons/wallet.svg"
                alt="Wallet Icon"
                width={24}
                height={24}
                style={{ marginRight: "8px", color: "white" }}
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
