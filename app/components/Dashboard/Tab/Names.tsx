import React, { useCallback, useEffect, useState } from "react";
import { Box, Divider, Grid, Pagination, alpha, styled } from "@mui/material";
import { WrappedDomain } from "@/redux/graphql/hooks";
import { NameCard } from "./Names/NameCard";
import {
  FlexCenter,
  InputField,
  SecondaryLabel,
} from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { debounce as _debounce, isEmpty } from "lodash";
import { isAccountLoading, scrollIntoElement } from "@/utils/common";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { useAccount } from "wagmi";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Address } from "viem";
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

interface NamesProps {
  hasMounted?: boolean;
  areNamesLoading?: boolean;
}

export const Names: React.FC<NamesProps> = (props: NamesProps) => {
  const { hasMounted, areNamesLoading } = props;

  const { status } = useAccount();
  const { useDashboard } = useDashboardState();
  const { names } = useDashboard();

  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(40);
  const [itemCountField, setItemCountField] = useState(40);
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

  const getTotalCountShowedItems = () => {
    const totalCount = names?.length || 0;

    const displayedCount = page * itemsPerPage;

    let displayedCountPerPage = itemsPerPage;
    if (displayedCount < totalCount) {
      displayedCountPerPage = displayedCount;
    } else {
      displayedCountPerPage = totalCount;
    }

    return displayedCountPerPage;
  };

  useEffect(() => {
    const count = getNumberOfPages();
    setPageCount(count);
  }, [names, itemsPerPage]);

  return (
    <>
      {(areNamesLoading || isAccountLoading(status) || !hasMounted) && (
        <SkeletonNames count={4} />
      )}

      {!isEmpty(names) && !isAccountLoading(status) && (
        <Container id="Names-Container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {names?.map((name, index) => {
                return (
                  <React.Fragment key={name.name}>
                    {shouldItemShow(index) ? (
                      <NameCard
                        item={name as WrappedDomain}
                        activeAddress={root.address as Address}
                      />
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
              <Pagination
                siblingCount={0}
                count={pageCount}
                page={page}
                onChange={(_, value) => {
                  setPage(value);
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
                <PaginationText>{`${getTotalCountShowedItems()} out of ${
                  names?.length
                }`}</PaginationText>
              </FlexCenter>
            </PaginationContainer>
          </FlexCenter>
        </Container>
      )}

      {isEmpty(names) &&
        status === "connected" &&
        !areNamesLoading &&
        hasMounted && (
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
