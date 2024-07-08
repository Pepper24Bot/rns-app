import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BaseInputField } from "@/components/Theme/StyledGlobal";
import { InputAdornment, styled } from "@mui/material";
import { debounce as _debounce } from "lodash";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { Search } from "@mui/icons-material";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import { usePathname, useRouter } from "next/navigation";

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
  const { updateSearchNameOrAddr, useLeaderboard } = useLeaderboardState();
  const { searchAddrOrName } = useLeaderboard();

  const router = useRouter();
  const pathName = usePathname();

  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setInputValue(searchAddrOrName || "");
  }, [searchAddrOrName]);

  const handleDebounceOnChange = (value: string) => {
    updateSearchNameOrAddr(value);
    if (!value && pathName.includes("/summary")) {
      router.push("/leaderboard/top-50", { scroll: false });
    }
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
