import React from "react";
import {
  Container,
  Search,
  SearchContainer,
  SearchField,
  SearchSubText,
  SearchTitle,
} from "./StyledSearch";
import {
  FlexCenter,
  Relative,
  SkeletonTypography,
} from "../Theme/StyledGlobal";
import { alpha } from "@mui/material";
import { pink } from "@mui/material/colors";

export const SkeletonForm: React.FC = () => {
  return (
    <Container>
      <FlexCenter>
        <SearchContainer>
          <Search height={332}>
            <Relative>
              <FlexCenter height="50px">
                <SkeletonTypography
                  variant="rectangular"
                  isloading={true}
                  width="35%"
                />
                <SearchTitle isloading={true}>Name Search</SearchTitle>
              </FlexCenter>
            </Relative>
            <Relative>
              <FlexCenter height="54px" pt={5}>
                <SkeletonTypography
                  variant="rectangular"
                  isloading={true}
                  width="85%"
                />
                <SearchSubText isloading={true}>Dummy text</SearchSubText>
              </FlexCenter>
            </Relative>
            <Relative>
              <FlexCenter>
                <SearchField
                  fullWidth
                  disabled
                  variant="outlined"
                  sx={{
                    "&.MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: alpha(pink[800], 0.15),
                      },
                    },
                  }}
                />
              </FlexCenter>
            </Relative>
          </Search>
        </SearchContainer>
      </FlexCenter>
    </Container>
  );
};

export default SkeletonForm;
