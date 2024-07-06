import React, { useCallback, useState } from "react";
import { BaseInputField } from "@/components/Theme/StyledGlobal";
import { InputAdornment, styled } from "@mui/material";
import { debounce as _debounce } from "lodash";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { Search } from "@mui/icons-material";

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

export const SearchIcon = styled(Search)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

export const SearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleDebounceOnChange = (value: string) => {
    console.log("value:: ", value);
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );
  return (
    <>
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
    </>
  );
};

export default SearchBar;
