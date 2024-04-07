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
import {
  ExpiryDate,
  Options,
  SortBy,
  SortOrder,
  View,
  useDashboardState,
} from "@/redux/dashboard/dashboardSlice";
import { ArrowDropDown } from "@mui/icons-material";
import MenuPopper from "./MenuPopper";
import DropDownMenu, { Option } from "./DropDownMenu";

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: "25px 0",
  borderColor: alpha(grey[800], 0.35),
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
  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,

  "&.MuiToggleButtonGroup-root": {
    ".MuiToggleButtonGroup-lastButton": {
      borderLeft: `solid 1px ${alpha(
        theme.palette.text.primary,
        0.15
      )} !important`,
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
    color: alpha(theme.palette.text.primary, 0.5),
    fontSize: "14px",
    textTransform: "capitalize",
    lineHeight: "normal",

    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: alpha(theme.palette.text.primary, 1),
    },

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.5),
    },
  },
}));

const SortValue = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  textTransform: "capitalize",
}));

const TypeLabel = styled(SortValue)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.35),
}));

const ArrowDownIcon = styled(ArrowDropDown)(({ theme }) => ({
  cursor: "pointer",
}));

const MenuField = styled(FieldContainer)(({ theme }) => ({
  padding: "8px 20px",
  cursor: "pointer",
}));

export interface FilterOption extends MenuPopper {
  toggleMenu: (value: boolean) => void;
}

export const FilterOption: React.FC<FilterOption> = (props: FilterOption) => {
  const { isOpen, anchorEl, toggleMenu } = props;
  const { useFilters } = useDashboardState();

  const options = useFilters();

  const [isSortOpen, setIsSortOption] = useState<boolean>(false);

  const [views, setViews] = useState<View[]>(options?.filter?.views || []);

  const initialSelectedOption = {
    label: options?.sort?.by || "Name",
    type: options?.sort?.order || "Ascending",
  };

  const [selectedOption, setSelectedOption] = useState<Option>(
    initialSelectedOption
  );

  const { updateFilterOptions } = useDashboardState();

  const handleViewsSelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    views: View[]
  ) => {
    setViews(views);
  };

  const handleCancel = () => {
    setViews(options?.filter?.views || []);
    setSelectedOption(initialSelectedOption);

    toggleMenu(false);
  };

  const handleSaveFilter = () => {
    const options: Options = {
      filter: {
        views,
      },
      sort: {
        by: selectedOption.label as SortBy,
        order: selectedOption.type as SortOrder,
      },
    };

    updateFilterOptions(options);
    toggleMenu(false);
  };

  return (
    <MenuPopper isOpen={isOpen} anchorEl={anchorEl}>
      <Grid width={275}>
        <Grid>
          <HeaderText>Filter By</HeaderText>
          <Divider />
          <Grid px={1}>
            <FlexJustified>
              <Field>View</Field>
              <ToggleButtonGroup value={views} onChange={handleViewsSelect}>
                <ToggleButton value="Active">Active</ToggleButton>
                <ToggleButton value="Expired">Expired</ToggleButton>
              </ToggleButtonGroup>
            </FlexJustified>
          </Grid>
        </Grid>
        <Divider />
        <Grid>
          <HeaderText>Sort By</HeaderText>
          <Grid mt={2.5}>
            <MenuField
              item
              xs
              onClick={() => {
                setIsSortOption(!isSortOpen);
              }}
            >
              <Flex>
                <SortValue>{selectedOption.label}</SortValue>
                <MuiDivider sx={{ mx: 1 }} flexItem orientation="vertical" />
                <TypeLabel>{selectedOption.type}</TypeLabel>
              </Flex>
              <DropDownMenu
                selectedOption={selectedOption}
                options={SORTING_OPTIONS}
                hasButton
                iconButton={<ArrowDownIcon />}
                isOpen={isSortOpen}
                handleOpen={() => {
                  setIsSortOption(true);
                }}
                handleClose={() => {
                  setIsSortOption(false);
                }}
                handleSelect={(option) => {
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
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={() => {
              handleSaveFilter();
            }}
            sx={{ width: "100px" }}
          >
            Save
          </ActionButton>
        </FlexRight>
      </Grid>
    </MenuPopper>
  );
};

export default FilterOption;
