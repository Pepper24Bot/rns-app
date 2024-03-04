import React from "react";
import {
  BaseIconButton,
  FieldContainer,
  Flex,
  FlexCenter,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { styled, alpha, Menu as MuiMenu, Grid } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import DropDownMenu, { Option } from "./DropDownMenu";

export interface Menu {
  options: Option[];
  label: string;
  selectedOption: string;
  arrow?: boolean;
  handleOptionSelect: (option: string) => void | any;
}

const PaymentLabel = styled(SecondaryLabel)(({ theme }) => ({
  margin: "10px 0 0 5px",
  fontSize: "16px",
  color: alpha(theme.palette.text.primary, 0.5),
}));

const ArrowDownIcon = styled(ArrowDropDown)(({ theme }) => ({
  cursor: "pointer",
}));

const Menu = styled(MuiMenu, {
  shouldForwardProp: (prop) => prop !== "arrow",
})<{ arrow?: boolean }>(({ theme, arrow }) => ({
  marginTop: arrow ? "" : "25px",
  marginLeft: arrow ? "" : "25px",

  ".MuiPaper-root": {
    borderRadius: "4px 4px 8px 8px",
    background: `linear-gradient(180deg, #000000 32.5%, ${alpha(
      theme.palette.primary.main,
      0.25
    )} 100%)`,
  },

  ".MuiMenu-list": {
    backgroundColor: theme.palette.background.paper,
    margin: "1px",
    borderRadius: "4px 4px 8px 8px",
    padding: "8px 0",
  },

  ".MuiMenuItem-root": {
    padding: "10px 25px",
  },

  ".MuiDivider-root": {
    margin: "0 15px !important", // override inline styling of mui
  },
}));

export const MenuField: React.FC<Menu> = (props: Menu) => {
  const { label, options, selectedOption, handleOptionSelect } = props;

  return (
    <Flex>
      <FlexCenter container>
        <Grid item xs={4.75}>
          <PaymentLabel>{label}</PaymentLabel>
        </Grid>
        <FieldContainer item xs>
          {selectedOption}
          <DropDownMenu
            selectedOption={selectedOption}
            options={options}
            hasButton
            iconButton={<ArrowDownIcon />}
            handleSelect={handleOptionSelect}
          />
        </FieldContainer>
      </FlexCenter>
    </Flex>
  );
};

export default MenuField;
