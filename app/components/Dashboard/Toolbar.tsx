import React, { useCallback, useState } from "react";
import {
  SearchField,
  SearchIcon,
  Toolbar as StyledToolbar,
} from "./StyledDashboard";
import { Grid, InputAdornment, IconButton } from "@mui/material";
import { Tune, ViewColumn } from "@mui/icons-material";
import { debounce as _debounce } from "lodash";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { FeatureList } from "@/hooks/useFeatureToggle";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";

import FeatureToggle from "../Reusables/FeatureToggle";
import FilterOption from "../Reusables/FilterOption";

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
