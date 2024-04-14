import React from "react";
import { Grid, styled, alpha, Divider as MuiDivider } from "@mui/material";
import {
  FlexCenter,
  Relative,
  SkeletonRectangular,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";

import Image from "next/image";

const Container = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isLoading",
})<{ isLoading?: boolean }>(({ theme, isLoading }) => ({
  padding: "35px 0",
}));

const ItemContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.darker, 0.75),
  borderRadius: "8px",
  boxShadow: `0px 0px 15px 0px ${theme.palette.background.paper}`,
}));

const ImageContainer = styled(Relative)(({ theme }) => ({
  padding: "20px",
}));

const Details = styled(Grid)(({ theme }) => ({
  padding: "20px",
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.background.dark, 0.85),
}));

export interface SkeletonProps {
  isLoading?: boolean;
  count?: number;
}

export const SkeletonNames: React.FC<SkeletonProps> = (
  props: SkeletonProps
) => {
  const { count } = props;

  return (
    <Container>
      <Grid container spacing={2}>
        {[...Array(count)].map((_, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
              <ItemContainer>
                <ImageContainer>
                  <SkeletonRectangular
                    isloading={true}
                    sx={{
                      width: "calc(100% - 40px)",
                      height: "calc(100% - 40px)",
                      transform: "scale(1)",
                      borderRadius: "4px",
                    }}
                  />
                  <Image
                    src="/images/rns-default.gif"
                    alt="Dummy Image Placeholder"
                    width={290}
                    height={200}
                    style={{
                      width: "-webkit-fill-available",
                      height: "-webkit-fill-available",
                      visibility: "hidden",
                    }}
                  />
                </ImageContainer>
                <Divider flexItem />
                <Details container>
                  <Grid item xs={12}>
                    <Grid height={45}>
                      <Relative>
                        <SkeletonTypography isloading={true} height={45} />
                      </Relative>
                    </Grid>
                    <Grid height={15}>
                      <Relative>
                        <SkeletonTypography
                          isloading={true}
                          height={15}
                          width="50%"
                        />
                      </Relative>
                    </Grid>
                    <Grid height={15}>
                      <Relative>
                        <SkeletonTypography
                          isloading={true}
                          height={15}
                          width="50%"
                        />
                      </Relative>
                    </Grid>
                  </Grid>
                </Details>
              </ItemContainer>
            </Grid>
          );
        })}
        {/* Placeholder for the pagination */}
      </Grid>
      <FlexCenter pt="100px" height={80}>
        <SkeletonTypography isloading={true} height={80} width="30%" />
      </FlexCenter>
    </Container>
  );
};

export default SkeletonNames;
