import React from "react";
import { Grid, styled, alpha, Box } from "@mui/material";
import {
  FlexRight,
  Relative,
  SkeletonRectangular,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";
import {
  Container,
  Detail,
  Divider,
  ImageContainer,
  ItemContainer,
} from "./StyledName";

import Image from "next/image";

const NamesContainer = styled(Grid)(({ theme }) => ({
  padding: "35px 0",
}));

const SkeletonText = styled(SkeletonTypography)(({ theme }) => ({}));

const SkeletonImage = styled(SkeletonRectangular)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.dark, 0.075),
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
    <NamesContainer>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {[...Array(count)].map((_, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                <Container>
                  <ItemContainer>
                    <ImageContainer>
                      <SkeletonImage
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
                    <Grid>
                      <Divider flexItem />
                      <Grid container p={2.5}>
                        <Grid item xs={12}>
                          <Grid height={45}>
                            <Relative>
                              <SkeletonText isloading={true} height={45} />
                              <Detail isloading={true}>RNS Identity</Detail>
                            </Relative>
                          </Grid>
                          <Grid>
                            <Relative>
                              <SkeletonText isloading={true} />
                              <Detail isloading={true}>
                                Linked to: Connect Address
                              </Detail>
                            </Relative>
                          </Grid>
                          <Grid>
                            <Relative>
                              <SkeletonText isloading={true} />
                              <Detail isloading={true}>
                                Expiry Date: Date In Days
                              </Detail>
                            </Relative>
                          </Grid>
                        </Grid>
                        <FlexRight item xs={12} pt={1}>
                          <Grid height={45}>
                            <Relative>
                              <SkeletonText isloading={true} height={45} />
                              <Detail isloading={true}>
                                SHARE REGISTRATION
                              </Detail>
                            </Relative>
                          </Grid>
                        </FlexRight>
                      </Grid>
                    </Grid>
                  </ItemContainer>
                </Container>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </NamesContainer>
  );
};

export default SkeletonNames;
