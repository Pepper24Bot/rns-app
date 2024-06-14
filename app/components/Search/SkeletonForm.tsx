import React from "react";
import {
  Container,
  Search,
  SearchContainer,
  SearchSubText,
  SearchTitle,
} from "./StyledSearch";
import {
  FlexCenter,
  Relative,
  SkeletonRectangular,
  SkeletonTypography,
} from "../Theme/StyledGlobal";

export const SkeletonForm: React.FC = () => {
  return (
    <Container>
      <FlexCenter>
        <SearchContainer>
          <Search>
            <Relative>
              <FlexCenter>
                <SkeletonTypography isloading={true} width="35%" />
                <SearchTitle isloading={true}>Name Search</SearchTitle>
              </FlexCenter>
            </Relative>
            <Relative>
              <FlexCenter>
                <SkeletonTypography
                  variant="rectangular"
                  isloading={true}
                  width="75%"
                />
                <SearchSubText isloading={true}>Dummy text</SearchSubText>
              </FlexCenter>
            </Relative>
            <Relative>
              <FlexCenter>
                <SkeletonRectangular isloading={true} width="75%" />
                <SearchSubText isloading={true}>Dummy text</SearchSubText>
              </FlexCenter>
            </Relative>
            <Relative>
              <FlexCenter>
                <SkeletonTypography
                  variant="rectangular"
                  isloading={true}
                  width="75%"
                />
                <SearchSubText isloading={true}>Dummy text</SearchSubText>
              </FlexCenter>
            </Relative>
          </Search>
        </SearchContainer>
      </FlexCenter>
    </Container>
  );
};

export default SkeletonForm;
