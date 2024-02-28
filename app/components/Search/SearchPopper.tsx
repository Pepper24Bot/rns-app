import React from "react";
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
  TextLabel,
} from "../Theme/StyledGlobal";
import { Star, StarBorder } from "@mui/icons-material";

import Image from "next/image";

export interface SearchPopper {
  isLoading: boolean;
  anchorEl: HTMLElement | null;
  searchValue: string | null;
  address?: `0x${string}`;

  // TODO: Fix any type
  data: any;
}

const Popper = styled(MuiPopper)(({ theme }) => ({
  zIndex: 15,
  marginTop: "5px !important", //override inline styling
  width: "100%",
  maxWidth: "500px",
}));

const SearchText = styled(SubTitle)(({ theme }) => ({
  fontWeight: 400,
  marginBottom: 0,
  textAlign: "start",
}));

const AvailableText = styled(TextLabel)(({ theme }) => ({
  color: "#24FF00",
  fontSize: "14px",
  textTransform: "uppercase",
  fontFamily: "var(--secondary-font)",
  marginTop: "5px",
}));

const NotAvailableText = styled(AvailableText)(({ theme }) => ({
  color: "#FF0000",
}));

const RegisteredText = styled(AvailableText)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const PopperContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  padding: "25px 40px",
  borderRadius: "0 0 8px 8px",
}));

const SearchButton = styled(BaseButton)(({ theme }) => ({
  textTransform: "uppercase",
  marginLeft: "20px",

  "&.MuiButtonBase-root": {
    backgroundColor: theme.palette.primary.dark,
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.background.paper,
      0.5
    )})`,
  },
}));

const FavoriteButton = styled(BaseIconButton)(({ theme }) => ({
  borderRadius: "32px",
  backgroundColor: "#161616",
  color: "#FFB800",
  marginRight: "20px",
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
  const { isLoading, data, address, anchorEl, searchValue } = props;

  const isAvailable = isEmpty(data?.nameWrappeds);

  const isNotAvailable =
    !isEmpty(data?.nameWrappeds) && data?.nameWrappeds[0].owner.id !== address;

  const isRegisteredByYou =
    !isEmpty(data?.nameWrappeds) && data?.nameWrappeds[0].owner.id === address;

  return (
    <Popper
      open={!isEmpty(searchValue) && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <PopperContainer>
            <FlexJustified>
              <Grid>
                <SearchText>{`${searchValue}.root`}</SearchText>
                <Relative>
                  <SkeletonTypography isloading={isLoading} />
                  {isAvailable ? (
                    <AvailableText isloading={isLoading}>
                      Available
                    </AvailableText>
                  ) : isRegisteredByYou ? (
                    <RegisteredText isloading={isLoading}>
                      Registered By You
                    </RegisteredText>
                  ) : (
                    <NotAvailableText isloading={isLoading}>
                      Not Available
                    </NotAvailableText>
                  )}
                </Relative>
              </Grid>
              <Grid>
                <Relative>
                  <Flex isloading={isLoading}>
                    <FavoriteButton>
                      {/* TODO: Add checker here - if favorite */}
                      {/* TODO: Add tooltip saying "Coming soon!" */}
                      {/* <FavoriteIcon /> */}
                      <StarIcon />
                    </FavoriteButton>
                    <Divider orientation="vertical" flexItem />
                    {isAvailable ? (
                      <SearchButton variant="contained">Register</SearchButton>
                    ) : isRegisteredByYou ? (
                      <SearchButton variant="contained">View</SearchButton>
                    ) : (
                      <Image
                        src="/icons/marketplace.svg"
                        alt="MarketPlace Icon"
                        width={36}
                        height={36}
                        style={{ marginLeft: "20px" }}
                      />
                    )}
                  </Flex>
                  <SkeletonRectangular
                    sx={{ position: "relative" }}
                    variant="rectangular"
                    isloading={isLoading}
                  />
                </Relative>
              </Grid>
            </FlexJustified>
          </PopperContainer>
        </Fade>
      )}
    </Popper>
  );
};

export default Popper;
