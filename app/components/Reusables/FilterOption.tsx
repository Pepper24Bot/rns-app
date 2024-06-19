import React, { useState } from "react";
import { Grid, Divider as MuiDivider, alpha, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  SecondaryLabel,
  FlexRight,
  ActionButton,
  FlexJustified,
  FieldContainer,
  Flex,
  ToggleButtonGroup,
  ToggleButton,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { SORTING_OPTIONS } from "@/constants/components";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { ArrowDropDown } from "@mui/icons-material";
import { isEmpty } from "lodash";
import { getOrderBy, getOrderDirection, parseCookie } from "@/utils/common";
import { View, SortBy, SortOrder } from "@/interfaces/global/types";
import { Option } from "@/interfaces/global/components";

import MenuPopper from "./MenuPopper";
import DropDownMenu from "./DropDownMenu";
import { OrderDirection } from "@/redux/graphql/hooks";

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

  const filterViews = (parseCookie("filterByViews")?.split(",") || [
    "Active",
  ]) as View[];

  const orderBy = getOrderBy();
  const orderDirection = getOrderDirection();

  const { updateFilterOptions, useFilters } = useDashboardState();
  const options = useFilters();

  const [isSortOpen, setIsSortOption] = useState<boolean>(false);
  const [views, setViews] = useState<View[]>(filterViews);

  const initialSorting = SORTING_OPTIONS.find((sort) => {
    return sort.orderBy === orderBy && sort.orderDirection === orderDirection;
  }) as Option;

  const [sortOption, setSortOption] = useState<Option>(initialSorting);

  const saveToCookies = () => {
    document.cookie = `filterByViews=${views}; path=/`;
    document.cookie = `orderBy=${sortOption.orderBy}; path=/`;
    document.cookie = `orderDirection=${sortOption.orderDirection}; path=/`;
  };

  const handleViewsSelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    views: View[]
  ) => {
    setViews(views);
  };

  const handleCancel = () => {
    setViews(filterViews || options?.filter?.views || []);
    setSortOption(initialSorting);
    toggleMenu(false);
  };

  const handleSaveFilter = () => {
    const allowExpired = views?.find((view) => {
      return view === "Expired";
    });

    updateFilterOptions({
      allowExpired: !isEmpty(allowExpired),
      orderBy: sortOption.orderBy,
      orderDirection: sortOption.orderDirection,
      filter: {
        views,
      },
      sort: {
        by: sortOption.label as SortBy,
        order: sortOption.type as SortOrder,
      },
    });

    saveToCookies();
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
                <ToggleButton value="Active" disabled>
                  Active
                </ToggleButton>
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
                <SortValue>{sortOption.label}</SortValue>
                <MuiDivider sx={{ mx: 1 }} flexItem orientation="vertical" />
                <TypeLabel>{sortOption.type}</TypeLabel>
              </Flex>
              <DropDownMenu
                selectedOption={sortOption}
                options={SORTING_OPTIONS as Option[]}
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
                  setSortOption(option);
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
