import React, { useCallback, useEffect, useState } from "react";
import { Box, Divider, Grid, IconButton, alpha, styled } from "@mui/material";
import { NameWrapped } from "@/redux/graphql/hooks";
import { NameCard } from "./Names/NameCard";
import {
  Flex,
  FlexCenter,
  InputField,
  SecondaryLabel,
} from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { DEFAULT_DEBOUNCE } from "@/services/constants";
import { debounce as _debounce, isEmpty } from "lodash";
import { isAccountLoading, scrollIntoElement } from "@/services/utils";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { useAccount } from "wagmi";
import SkeletonNames from "./Names/SkeletonNames";

const Container = styled(Grid)(({ theme }) => ({
  padding: "35px 0",
}));

const Label = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const Description = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  marginTop: "8px",
  color: theme.palette.text.secondary,
  fontWeight: FONT_WEIGHT.Light,
}));

const PaginationContainer = styled(FlexCenter)(({ theme }) => ({
  padding: "10px",
  borderRadius: "4px",
  backgroundColor: alpha(theme.palette.background.darker, 0.5),
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

const PageNumberText = styled(PaginationText, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: isActive ? FONT_WEIGHT.Bold : FONT_WEIGHT.Regular,
  textDecoration: isActive ? "underline" : "",
  fontSize: isActive ? "14px" : "14px",
  padding: "4px",
}));

const PageButton = styled(IconButton)(({ theme }) => ({
  padding: "4px",
}));

export const Names: React.FC = () => {
  const { status } = useAccount();
  const { useDashboard } = useDashboardState();
  const { names, isNameListLoading } = useDashboard();

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [itemCountField, setItemCountField] = useState(4);
  const [pageCount, setPageCount] = useState(1);

  const handleDebounceOnChange = (value: number) => {
    setItemsPerPage(value);
    setPage(1);

    // Scroll to the top
    scrollIntoElement("Dashboard-Container");
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  const getNumberOfPages = () => {
    const pages = Math.ceil((names?.length || 0) / itemsPerPage);
    return pages;
  };

  const shouldItemShow = (index: number) => {
    if (page === 1) {
      return index < page * itemsPerPage;
    }

    return index < page * itemsPerPage && index >= (page - 1) * itemsPerPage;
  };

  useEffect(() => {
    const count = getNumberOfPages();
    setPageCount(count);
  }, [names, itemsPerPage]);

  // Set itemsPerPage based on the client width
  // TODO: Clean this
  useEffect(() => {
    const clientWidth = document?.documentElement?.clientWidth;
    if (clientWidth >= 900 && clientWidth <= 1200) {
      setItemsPerPage(3);
      setItemCountField(3);
    }
  }, []);

  return (
    <>
      {(isNameListLoading || isAccountLoading(status)) && (
        <SkeletonNames count={itemsPerPage} />
      )}
      {!isEmpty(names) && !isAccountLoading(status) && (
        <Container id="Names-Container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {names?.map((name, index) => {
                return (
                  <React.Fragment key={name.name}>
                    {shouldItemShow(index) ? (
                      <NameCard item={name as NameWrapped} />
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                );
              })}
            </Grid>
          </Box>
          {/* TODO: Make this a reusable component */}
          <FlexCenter pt="100px">
            <PaginationContainer>
              <Flex px={1}>
                <PageField
                  value={itemCountField}
                  onChange={(event) => {
                    const { value } = event.target;
                    const itemCount = Number(value);
                    if (itemCount) {
                      debounceFn(itemCount);
                      setItemCountField(itemCount);
                    }
                  }}
                />
                <PaginationText>Items per page</PaginationText>
              </Flex>
              <Divider flexItem orientation="vertical" />
              <FlexCenter px={1}>
                <Flex>
                  <PageButton
                    disabled={page === 1}
                    onClick={() => {
                      setPage(page - 1);
                    }}
                  >
                    <KeyboardArrowLeft />
                  </PageButton>
                  <PaginationText isEnabled={page !== 1}>Prev</PaginationText>
                </Flex>
                <Flex px={1}>
                  {[...Array(pageCount)].map((_, index) => {
                    return (
                      <PageButton
                        key={`page-${index + 1}`}
                        sx={{ py: 0 }}
                        onClick={() => {
                          setPage(index + 1);
                        }}
                      >
                        <PageNumberText isActive={index + 1 === page}>
                          {index + 1}
                        </PageNumberText>
                      </PageButton>
                    );
                  })}
                </Flex>
                <Flex>
                  <PaginationText isEnabled={page !== pageCount}>
                    Next
                  </PaginationText>
                  <PageButton
                    disabled={page === pageCount}
                    onClick={() => {
                      setPage(page + 1);
                    }}
                  >
                    <KeyboardArrowRight />
                  </PageButton>
                </Flex>
              </FlexCenter>
              <Divider flexItem orientation="vertical" />
              <Grid px={1}>
                <PaginationText>{`${itemsPerPage} out of ${names?.length}`}</PaginationText>
              </Grid>
            </PaginationContainer>
          </FlexCenter>
        </Container>
      )}

      {isEmpty(names) && !isAccountLoading(status) && !isNameListLoading && (
        <Container>
          <Label>No Names found</Label>
          <Description>
            There is no registered name under your account.
          </Description>
        </Container>
      )}
    </>
  );
};

export default Names;
