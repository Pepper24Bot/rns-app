import React, { useEffect, useState } from "react";
import { Fade, Grid, Divider } from "@mui/material";
import { isEmpty } from "lodash";
import {
  FlexJustified,
  Relative,
  SkeletonTypography,
  SkeletonRectangular,
  InformationTip,
  AvailableText,
  NotAvailableText,
  RegisteredText,
  FlexRight,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { parseCookie } from "@/utils/common";
import { useRouter } from "next/navigation";
import { NameStatus } from "@/interfaces/global/types";
import {
  Popper,
  PopperContainer,
  SearchText,
  ButtonsContainer,
  FavoriteButton,
  StarIcon,
  SearchButton,
  SearchLabel,
  NextImage,
} from "./StyledSearch";
import { FeatureList } from "@/hooks/useFeatureToggle";
import FeatureToggle from "../Reusables/FeatureToggle";

export interface SearchPopper {
  isLoading: boolean;
  anchorEl: HTMLElement | null;
  searchValue: string | null;
  address?: `0x${string}`;
  status?: NameStatus | "";
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
        return (
          <NotAvailableText isloading={isLoading}>{status}</NotAvailableText>
        );
      default:
        return <NotAvailableText isloading={true}>Loading</NotAvailableText>;
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
                    <FeatureToggle feature={FeatureList.Favorites}>
                      <InformationTip title="Coming soon!" arrow>
                        <FavoriteButton>
                          {/* TODO: Add checker here - if favorite */}
                          {/* TODO: Add tooltip saying "Coming soon!" */}
                          {/* <FavoriteIcon /> */}
                          <StarIcon />
                        </FavoriteButton>
                      </InformationTip>
                    </FeatureToggle>
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
                                item: data,
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
                            src="/icons/tradeverse.png"
                            alt="Tradeverse Icon"
                            width={32}
                            height={32}
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
                                item: data,
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

export default SearchPopper;
