import React from "react";
import { FlexCenter, InputField, SecondaryLabel } from "../Theme/StyledGlobal";
import {
  Divider,
  alpha,
  styled,
  Pagination as MuiPagination,
} from "@mui/material";

const PaginationContainer = styled(FlexCenter)(({ theme }) => ({
  width: "fit-content",
  padding: "8px",
  borderRadius: "8px",
  border: `solid 1px ${alpha(theme.palette.primary.dark, 0.5)}`,
  filter: `drop-shadow(0px 0px 10px ${alpha(
    theme.palette.background.paper,
    0.75
  )})`,
}));

const PageField = styled(InputField)(({ theme }) => ({
  "&.MuiFormControl-root": {
    width: "50px",
  },

  ".MuiInputBase-input": {
    textAlign: "center",
  },

  ".MuiInputBase-root": {
    backgroundColor: alpha(theme.palette.background.paper, 0.25),

    "&.MuiOutlinedInput-root": {
      padding: "8px",
      "& fieldset": {
        borderColor: theme.palette.background.dark,
      },
    },
  },
}));

const PaginationText = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "isEnabled",
})<{ isEnabled?: boolean }>(({ theme, isEnabled }) => ({
  fontSize: "14px",
  padding: "0 8px",
  color: isEnabled
    ? theme.palette.text.primary
    : alpha(theme.palette.text.primary, 0.35),
}));

interface PaginationProps {
  pageCount: number;
  page: number;
  totalItemsCount: number;
  itemsPerPage?: number;

  /** By default, this is 40 but user can change this */
  inputValue?: number;
  handleInputChange?: (value: number) => void;
  setPage?: (value: number) => void;
}

export const Pagination: React.FC<PaginationProps> = (
  props: PaginationProps
) => {
  const {
    pageCount,
    page,
    totalItemsCount,
    itemsPerPage = 1,
    inputValue = 50,
    handleInputChange,
    setPage,
  } = props;

  const getTotalCountShowedItems = () => {
    const totalCount = totalItemsCount || 0;

    const displayedCount = page * itemsPerPage;

    let displayedCountPerPage = itemsPerPage;
    if (displayedCount < totalCount) {
      displayedCountPerPage = displayedCount;
    } else {
      displayedCountPerPage = totalCount;
    }

    return displayedCountPerPage;
  };

  return (
    <PaginationContainer
      sx={{
        display: {
          xs: "block",
          sm: "flex",
        },
      }}
    >
      <FlexCenter px={1}>
        <PageField
          value={inputValue}
          onChange={(event) => {
            const { value } = event.target;
            const itemCount = Number(value);
            handleInputChange && handleInputChange(itemCount);
          }}
        />
        <PaginationText>Items per page</PaginationText>
      </FlexCenter>
      <Divider
        flexItem
        orientation="vertical"
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },
        }}
      />
      <Divider
        flexItem
        orientation="horizontal"
        sx={{
          mt: "8px",
          display: {
            xs: "block",
            sm: "none",
          },
        }}
      />
      <MuiPagination
        siblingCount={0}
        count={pageCount}
        page={page}
        onChange={(_, value) => {
          setPage && setPage(value);
        }}
      />
      <Divider
        flexItem
        orientation="vertical"
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },
        }}
      />
      <Divider
        flexItem
        orientation="horizontal"
        sx={{
          mb: "8px",
          display: {
            xs: "block",
            sm: "none",
          },
        }}
      />
      <FlexCenter px={1}>
        <PaginationText>{`${getTotalCountShowedItems()} out of ${totalItemsCount}`}</PaginationText>
      </FlexCenter>
    </PaginationContainer>
  );
};

export default Pagination;
