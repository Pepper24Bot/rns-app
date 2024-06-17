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
          <Search>
            <Relative>
              <FlexCenter>
                <SkeletonTypography isloading={true} width="50%" />
                <SearchTitle isloading={true}>Name Search</SearchTitle>
              </FlexCenter>
            </Relative>
            <Relative>
              <FlexCenter>
                <SkeletonTypography isloading={true} width="95%" />
                <SearchSubText isloading={true}>
                  Your premier cross platform, data, social and wallet identity
                  on The Root Network. Take your identity and data wherever you
                  go.
                </SearchSubText>
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
                        borderColor: alpha(pink[900], 0.05),
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
