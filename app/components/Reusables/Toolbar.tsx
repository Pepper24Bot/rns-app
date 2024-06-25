import React, { useCallback, useState } from "react";
import { Grid, InputAdornment, IconButton, styled } from "@mui/material";
import { Tune, ViewColumn, Search as MuiSearchIcon } from "@mui/icons-material";
import { debounce as _debounce } from "lodash";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { FeatureList } from "@/hooks/useFeatureToggle";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { BaseInputField } from "../Theme/StyledGlobal";

import FeatureToggle from "./FeatureToggle";
import FilterOption from "./FilterOption";

export const SearchField = styled(BaseInputField)(({ theme }) => ({
  ".MuiInputBase-input": {
    padding: "10px 16px 10px 25px",
  },

  ".MuiInputBase-root": {
    backgroundColor: theme.palette.background.darker,
  },

  "&.MuiFormControl-root": {
    width: "100%",
  },
}));

export const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

export const StyledToolbar = styled(Grid)(({ theme }) => ({
  paddingTop: "10px",
}));

export const Toolbar: React.FC = () => {
  const { updateFilterOptions, useFilters } = useDashboardState();
  const options = useFilters();

  const [inputValue, setInputValue] = useState<string>(options?.name || "");
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [viewAnchor, setViewAnchor] = useState<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  const handleDebounceOnChange = (value: string) => {
    updateFilterOptions({
      name: value,
      page: 1, // reset active page in pagination when search name is updated
    });
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  return (
    <>
      <StyledToolbar container>
        <Grid item xs>
          <SearchField
            variant="filled"
            placeholder="Search..."
            value={inputValue}
            onChange={(event) => {
              const { value } = event.target;
              setInputValue(value);
              debounceFn(value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <IconButton
            onClick={(event) => {
              setIsFilterOpen(!isFilterOpen);
              setIsViewOpen(false);
              setFilterAnchor(event.currentTarget);
            }}
          >
            <Tune />
          </IconButton>
          <FeatureToggle feature={FeatureList.ViewOptions}>
            <IconButton
              onClick={(event) => {
                setIsViewOpen(!isViewOpen);
                setIsFilterOpen(false);
                setViewAnchor(event.currentTarget);
              }}
            >
              <ViewColumn />
            </IconButton>
          </FeatureToggle>
        </Grid>
      </StyledToolbar>
      <FilterOption
        toggleMenu={setIsFilterOpen}
        isOpen={isFilterOpen}
        anchorEl={filterAnchor}
      />
    </>
  );
};

export default Toolbar;
