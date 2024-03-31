import React, { useState } from "react";
import {
  Grid,
  Divider as MuiDivider,
  ToggleButton as MuiToggleButton,
  ToggleButtonGroup as MuiToggleGroup,
  alpha,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  SecondaryLabel,
  FlexRight,
  ActionButton,
  FlexJustified,
  FieldContainer,
  Flex,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { SORTING_OPTIONS } from "@/services/constants";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { ArrowDropDown } from "@mui/icons-material";
import MenuPopper from "./MenuPopper";
import DropDownMenu, { Option } from "./DropDownMenu";

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: "20px 0",
  borderColor: alpha(grey[800], 0.5),
}));

const HeaderText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const Field = styled(SecondaryLabel)(({ theme }) => ({
  textTransform: "uppercase",
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.5),
}));

const ToggleButtonGroup = styled(MuiToggleGroup)(({ theme }) => ({
  borderRadius: "8px",
  minWidth: "150px",
  border: `1px solid ${alpha(theme.palette.primary.dark, 0.75)}`,

  "&.MuiToggleButtonGroup-root": {
    ".MuiToggleButtonGroup-lastButton": {
      borderLeft: `solid 1px ${theme.palette.primary.dark} !important`,
      marginLeft: 0,
    },
  },
}));

const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  borderRadius: "8px",
  borderColor: alpha(theme.palette.text.primary, 0.15),
  padding: "8px",
  height: "fit-content",
  width: "50%",
  backgroundColor: alpha(theme.palette.primary.dark, 0.25),

  "&.MuiToggleButton-root": {
    border: "none",

    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
    },

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.5),
    },
  },
}));

const ValueText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  textTransform: "capitalize",
}));

const ArrowDownIcon = styled(ArrowDropDown)(({ theme }) => ({
  cursor: "pointer",
}));

const MenuField = styled(FieldContainer)(({ theme }) => ({
  padding: "8px 20px",
}));

export interface FilterOption extends MenuPopper {
  toggleMenu: (value: boolean) => void;
}

export const FilterOption: React.FC<FilterOption> = (props: FilterOption) => {
  const { isOpen, anchorEl, toggleMenu } = props;

  const [views, setViews] = useState<string[]>([]);
  const [expiry, setExpiry] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "Name",
    type: "Ascending",
  });

  const { updateFilterOptions } = useDashboardState();

  const handleViewsSelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    views: string[]
  ) => {
    setViews(views);
  };

  const handleExpirySelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    expiry: string[]
  ) => {
    setExpiry(expiry);
  };

  const handleCancel = () => {
    setViews([]);
    setExpiry([]);
  };

  const handleSaveFilter = () => {
    console.log("views:: ", views);
    console.log("expiry:: ", expiry);
  };

  return (
    <MenuPopper isOpen={isOpen} anchorEl={anchorEl}>
      <Grid width={275}>
        <Grid>
          <HeaderText>Filter By</HeaderText>
          <Divider />
          <Grid px={2}>
            <FlexJustified py={0.5}>
              <Field>View</Field>
              <ToggleButtonGroup value={views} onChange={handleViewsSelect}>
                <ToggleButton value="Active">
                  <ValueText>Active</ValueText>
                </ToggleButton>
                <ToggleButton value="Expired">
                  <ValueText>Expired</ValueText>
                </ToggleButton>
              </ToggleButtonGroup>
            </FlexJustified>
            <FlexJustified py={0.5}>
              <Field>Expiry Date</Field>
              <ToggleButtonGroup value={expiry} onChange={handleExpirySelect}>
                <ToggleButton value="High">
                  <ValueText>High</ValueText>
                </ToggleButton>
                <ToggleButton value="Low">
                  <ValueText>Low</ValueText>
                </ToggleButton>
              </ToggleButtonGroup>
            </FlexJustified>
          </Grid>
        </Grid>
        <Divider />
        <Grid>
          <HeaderText>Sort By</HeaderText>
          <Grid mt={2.5}>
            <MenuField item xs>
              <Flex>
                {/* <ValueText>{selectedOption.}</ValueText> */}
                <ValueText>{selectedOption.label}</ValueText>
              </Flex>
              <DropDownMenu
                selectedOption={selectedOption}
                options={SORTING_OPTIONS}
                hasButton
                iconButton={<ArrowDownIcon />}
                handleSelect={(option) => {
                  console.log("option:: ", option);
                  setSelectedOption(option);
                }}
              />
            </MenuField>
          </Grid>
        </Grid>
        <Divider />
        <FlexRight>
          <ActionButton
            sx={{ mr: 2 }}
            variant="text"
            onClick={() => {
              handleCancel();
              toggleMenu(false);
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={() => {
              handleSaveFilter();
            }}
          >
            Save
          </ActionButton>
        </FlexRight>
      </Grid>
    </MenuPopper>
  );
};

export default FilterOption;
