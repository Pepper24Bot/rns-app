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
  Flex,
  SkeletonRectangular,
  BaseButton,
  BaseIconButton,
  SubTitle,
  InformationTip,
  SecondaryLabel,
  AvailableText,
  NotAvailableText,
  RegisteredText,
} from "../Theme/StyledGlobal";
import { Star, StarBorder } from "@mui/icons-material";
import { useModalState } from "@/redux/modal/modalSlice";
import { FONT_SIZE, FONT_WEIGHT } from "../Theme/Global";
import { NameStatus } from "@/redux/domain/domainSlice";

import Image from "next/image";

export interface SearchPopper {
  isLoading: boolean;
  anchorEl: HTMLElement | null;
  searchValue: string | null;
  address?: `0x${string}`;
  status?: NameStatus;

  // TODO: Fix any type
  data?: any;
}

const Popper = styled(MuiPopper)(({ theme }) => ({
  zIndex: 15,
  marginTop: "5px !important", //override inline styling
  width: "100%",
}));

const SearchText = styled(SubTitle)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  marginBottom: 0,
  textAlign: "start",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Medium,
  },
}));

const PopperContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  padding: "25px 40px",
  borderRadius: "0 0 8px 8px",

  [theme.breakpoints.down("md")]: {
    padding: "10px 25px 15px 25px",
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
    backgroundColor: theme.palette.primary.dark,
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.background.paper,
      0.5
    )})`,

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
  padding: "8px",
  backgroundColor: "#161616",
  color: "#FFB800",
  margin: "0 10px",
}));

const FavoriteIcon = styled(Star)(({ theme }) => ({
  height: "20px",
  width: "20px",
}));

const StarIcon = styled(StarBorder)(({ theme }) => ({
  height: "20px",
  width: "20px",
}));

export const SearchPopper: React.FC<SearchPopper> = (props: SearchPopper) => {
  const { isLoading, anchorEl, searchValue, status } = props;
  const { toggleModal } = useModalState();

  const [clientWidth, setClientWidth] = useState<number>(
    anchorEl?.clientWidth || 500
  );

  useEffect(() => {
    if (anchorEl?.clientWidth) {
      setClientWidth(anchorEl?.clientWidth);
    }
  }, [anchorEl?.clientWidth]);

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
              <Grid>
                <SearchText>{`${searchValue}.root`}</SearchText>
                <Relative>
                  <SkeletonTypography isloading={isLoading} />
                  {status === "Available" ? (
                    <AvailableText isloading={isLoading}>
                      {status}
                    </AvailableText>
                  ) : status === "Registered" ? (
                    <RegisteredText isloading={isLoading}>
                      Registered By You
                    </RegisteredText>
                  ) : (
                    <NotAvailableText isloading={isLoading}>
                      {status}
                    </NotAvailableText>
                  )}
                </Relative>
              </Grid>
              <ButtonsContainer>
                <Relative>
                  <Flex isloading={isLoading}>
                    <InformationTip title="Coming soon!" arrow>
                      <FavoriteButton>
                        {/* TODO: Add checker here - if favorite */}
                        {/* TODO: Add tooltip saying "Coming soon!" */}
                        {/* <FavoriteIcon /> */}
                        <StarIcon />
                      </FavoriteButton>
                    </InformationTip>
                    <Divider orientation="vertical" flexItem />
                    {status === "Available" ? (
                      <SearchButton
                        variant="contained"
                        onClick={() => {
                          toggleModal({
                            id: "Register Name",
                            title: "Register",
                          });
                        }}
                      >
                        <SearchLabel>Register</SearchLabel>
                      </SearchButton>
                    ) : status === "Registered" ? (
                      <SearchButton
                        variant="contained"
                        onClick={() => {
                          toggleModal({
                            id: "Registration Details",
                            title: "Registration Details",
                          });
                        }}
                      >
                        View
                      </SearchButton>
                    ) : (
                      <InformationTip
                        title="View on secondary marketplace."
                        arrow
                      >
                        <Image
                          src="/icons/marketplace.svg"
                          alt="MarketPlace Icon"
                          width={36}
                          height={36}
                          style={{ marginLeft: "20px", cursor: "pointer" }}
                        />
                      </InformationTip>
                    )}
                  </Flex>
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
