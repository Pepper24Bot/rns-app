import React, { useState } from "react";
import {
  ErrorTip,
  FlexCenter,
  InputField,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import {
  Divider,
  alpha,
  styled,
  Pagination as MuiPagination,
  Grid,
} from "@mui/material";
import { red } from "@mui/material/colors";

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
    width: "75px",
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
      "&.Mui-focused fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.25),
      },

      "&.Mui-error fieldset": {
        borderColor: red[800],
        borderWidth: "2px",
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
    handleInputChange,
    setPage,
  } = props;

  const [itemCountField, setItemCountField] = useState(itemsPerPage);
  const [errorField, setErrorField] = useState(false);

  const handleOnChange = (itemCount: number) => {
    setErrorField(false);
    setItemCountField(itemCount);
    handleInputChange && handleInputChange(itemCount);

    if (itemCount < 0 || itemCount > 1000) {
      // throw error
      setErrorField(true);
    }
  };

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
    <Grid>
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
            error={errorField}
            value={itemCountField}
            onChange={(event) => {
              const { value } = event.target;
              const itemCount = Number(value);
              handleOnChange(itemCount);
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
      {errorField && (
        <ErrorTip pt={1} pl={1} sx={{ textAlign: "start" }}>
          Maximum items per page is 1000
        </ErrorTip>
      )}
    </Grid>
  );
};

export default Pagination;
