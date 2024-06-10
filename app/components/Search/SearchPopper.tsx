import React, { useEffect, useState } from "react";
import {
  Fade,
  Grid,
  alpha,
  styled,
  Popper as MuiPopper,
  Divider,
} from "@mui/material";
import { isEmpty } from "lodash";
import {
  FlexJustified,
  Relative,
  SkeletonTypography,
  SkeletonRectangular,
  BaseButton,
  BaseIconButton,
  SubTitle,
  InformationTip,
  SecondaryLabel,
  AvailableText,
  NotAvailableText,
  RegisteredText,
  FlexRight,
} from "../Theme/StyledGlobal";
import { Star, StarBorder } from "@mui/icons-material";
import { useModalState } from "@/redux/modal/modalSlice";
import { FONT_SIZE, FONT_WEIGHT } from "../Theme/Global";
import { NameStatus } from "@/redux/domain/domainSlice";
import { parseCookie } from "@/utils/common";
import { useRouter } from "next/navigation";

import Image from "next/image";

const Popper = styled(MuiPopper)(({ theme }) => ({
  zIndex: 15,
  marginTop: "5px !important", //override inline styling
  width: "100%",
}));

const SearchText = styled(SubTitle)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  marginBottom: 0,
  textAlign: "start",
  wordBreak: "break-word",
  fontFamily: "var(--secondary-font)",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Medium,
  },
}));

const PopperContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  padding: "20px",
  borderRadius: "0 0 8px 8px",

  [theme.breakpoints.down("md")]: {
    padding: "10px 15px 15px",
  },
}));

const ButtonsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    paddingTop: "20px",
  },
}));

const SearchButton = styled(BaseButton)(({ theme }) => ({
  textTransform: "uppercase",
  marginLeft: "10px",

  "&.MuiButtonBase-root": {
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.background.paper,
      0.5
    )})`,

    "&.MuiButton-contained": {
      backgroundColor: theme.palette.primary.dark,
      "&.Mui-disabled": {
        backgroundColor: alpha(theme.palette.primary.dark, 0.25),
      },
    },

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
  },
}));

const SearchLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  fontSize: "14px",
  padding: "4px 0",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Small,
  },
}));

const FavoriteButton = styled(BaseIconButton)(({ theme }) => ({
  borderRadius: "32px",
  padding: "4px",
  backgroundColor: "#161616",
  color: "#FFB800",
  marginLeft: "8px",
}));

const FavoriteIcon = styled(Star)(({ theme }) => ({
  height: "20px",
  width: "20px",
}));

const StarIcon = styled(StarBorder)(({ theme }) => ({
  height: "20px",
  width: "20px",
}));

const NextImage = styled(Image)(({ theme }) => ({
  margin: "0 8px",
  cursor: "pointer",
}));

export interface SearchPopper {
  isLoading: boolean;
  anchorEl: HTMLElement | null;
  searchValue: string | null;
  address?: `0x${string}`;
  status?: NameStatus;
  isNameInvalid?: boolean;
  isNameNotSupported?: boolean;
  data?: any;
}

export const SearchPopper: React.FC<SearchPopper> = (props: SearchPopper) => {
  const {
    isLoading,
    anchorEl,
    searchValue,
    status,
    isNameInvalid,
    isNameNotSupported,
    data,
  } = props;

  const router = useRouter();

  const { toggleModal } = useModalState();

  const isInformationHidden =
    parseCookie("registration_process_hidden") === "true";

  const [clientWidth, setClientWidth] = useState<number>(
    anchorEl?.clientWidth || 500
  );

  useEffect(() => {
    if (anchorEl?.clientWidth) {
      setClientWidth(anchorEl?.clientWidth);
    }
  }, [anchorEl?.clientWidth]);

  const getStatus = () => {
    switch (status) {
      case "Available":
        return <AvailableText isloading={isLoading}>{status}</AvailableText>;
      case "Registered":
        return (
          <RegisteredText isloading={isLoading}>
            Registered By You
          </RegisteredText>
        );
      case "Invalid":
      case "Not Available":
      default:
        return (
          <NotAvailableText isloading={isLoading}>{status}</NotAvailableText>
        );
    }
  };

  return (
    <Popper
      open={!isEmpty(searchValue) && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
      sx={{
        maxWidth: `${clientWidth}px`,
      }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <PopperContainer>
            <FlexJustified container>
              <Grid item xs={6}>
                <SearchText>{`${searchValue}.root`}</SearchText>
                <Relative>
                  <SkeletonTypography isloading={isLoading} />
                  {getStatus()}
                </Relative>
              </Grid>
              <ButtonsContainer item xs={4.5}>
                <Relative>
                  <FlexRight isloading={isLoading}>
                    <InformationTip title="Coming soon!" arrow>
                      <FavoriteButton>
                        {/* TODO: Add checker here - if favorite */}
                        {/* TODO: Add tooltip saying "Coming soon!" */}
                        {/* <FavoriteIcon /> */}
                        <StarIcon />
                      </FavoriteButton>
                    </InformationTip>
                    {status === "Available" ||
                    status === "Invalid" ||
                    status === "Not Supported" ? (
                      <Grid>
                        <SearchButton
                          disabled={isNameInvalid || isNameNotSupported}
                          variant="contained"
                          onClick={() => {
                            if (isInformationHidden) {
                              toggleModal({
                                id: "Register Name",
                                title: "Register",
                                isCloseDisabled: true,
                                isXDisabled: true,
                                data: {
                                  name: searchValue,
                                },
                              });
                              router.replace(`/${searchValue}`, {
                                scroll: false,
                              });
                            } else {
                              toggleModal({
                                id: "Registration Info",
                                title: "Registration Process",
                                data: {
                                  label: searchValue,
                                },
                              });
                            }
                          }}
                        >
                          <SearchLabel
                            isDisabled={isNameInvalid || isNameNotSupported}
                          >
                            Register
                          </SearchLabel>
                        </SearchButton>
                      </Grid>
                    ) : status === "Registered" ? (
                      <>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ ml: 1 }}
                        />
                        <SearchButton
                          variant="contained"
                          onClick={() => {
                            toggleModal({
                              id: "Registration Details",
                              title: "Registration Details",
                              data: {
                                name: `${searchValue}.root` || "",
                                domain: data,
                              },
                            });
                            router.replace(`/${searchValue}`, {
                              scroll: false,
                            });
                          }}
                        >
                          View
                        </SearchButton>
                      </>
                    ) : (
                      <>
                        <InformationTip
                          title="View on secondary marketplace."
                          arrow
                        >
                          <NextImage
                            src="/icons/marketplace.svg"
                            alt="MarketPlace Icon"
                            width={24}
                            height={24}
                          />
                        </InformationTip>
                        <Divider orientation="vertical" flexItem />
                        <SearchButton
                          variant="contained"
                          onClick={() => {
                            toggleModal({
                              id: "Registration Details",
                              title: "Registration Details",
                              data: {
                                name: `${searchValue}.root` || "",
                                domain: data,
                              },
                            });
                            router.replace(`/${searchValue}`, {
                              scroll: false,
                            });
                          }}
                        >
                          View
                        </SearchButton>
                      </>
                    )}
                  </FlexRight>
                  <SkeletonRectangular
                    sx={{ position: "relative" }}
                    variant="rectangular"
                    isloading={isLoading}
                  />
                </Relative>
              </ButtonsContainer>
            </FlexJustified>
          </PopperContainer>
        </Fade>
      )}
    </Popper>
  );
};

export default Popper;
