import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Grid, styled } from "@mui/material";
import { NameCard } from "./Names/NameCard";
import { FlexCenter, SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { debounce as _debounce, isEmpty } from "lodash";
import {
  getIsAllowedExpired,
  getOrderBy,
  getOrderDirection,
  parseCookie,
  scrollIntoElement,
} from "@/utils/common";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Address } from "viem";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";

import SkeletonNames from "./Names/SkeletonNames";
import Pagination from "@/components/Reusables/Pagination";
import useAllNamesForAddress from "@/hooks/useAllNamesForAddress";

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

interface NamesProps {
  hasMounted?: boolean;
}

export const Names: React.FC<NamesProps> = (props: NamesProps) => {
  const { hasMounted } = props;

  const { useFilters, updateFilterOptions } = useDashboardState();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

  const options = useFilters();

  // initial values for pagination
  const pageSize = Number(parseCookie("itemsPerPage")) || 50;

  // This is used so the tooltips in each name card will not go beyond the screensize
  const boundingElement = useRef<HTMLDivElement | null>(null);

  const orderBy = getOrderBy(options?.orderBy);
  const orderDirection = getOrderDirection(options?.orderDirection);
  const allowExpired = getIsAllowedExpired(options?.allowExpired);

  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  const { names, isFetching, isFetched, isError, totalNames, pageCount } =
    useAllNamesForAddress({
      // custom props
      skip: !hasMounted,
      page: options?.page,

      // ensjs.getNamesForAddress props
      address: address || "0x",
      orderBy,
      orderDirection,
      pageSize: itemsPerPage,
      filter: {
        searchType: "name", // default - search by name
        searchString: options?.name?.toLowerCase(),
        allowExpired,
      },
    });

  const isLoadingState = isFetching || !hasMounted || (!isFetched && !isError);
  const hasNoNamesState =
    (isEmpty(names) && isFetched && !isFetching) || isError;

  const handleDebounceOnChange = (value: number) => {
    if (value > 0 && value <= 1000) {
      updateFilterOptions({ page: 1 });
      setItemsPerPage(value);
      // store in cookies
      document.cookie = `itemsPerPage=${value}; path=/`;

      // Scroll to the top
      scrollIntoElement("Dashboard-Container");
    }
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  return (
    <>
      {isLoadingState && <SkeletonNames />}

      {hasNoNamesState && (
        <Container>
          <Label>No Names found</Label>
          <Description>
            There is no registered name under your account.
          </Description>
        </Container>
      )}

      {!isEmpty(names) && (
        <Container id="Names-Container" ref={boundingElement}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {names?.map((name) => {
                return (
                  <React.Fragment key={name.name}>
                    <NameCard
                      item={name}
                      address={address as Address}
                      boundingArea={boundingElement.current}
                    />
                  </React.Fragment>
                );
              })}
            </Grid>
          </Box>
          <FlexCenter pt={12}>
            <Pagination
              pageCount={pageCount}
              totalItemsCount={totalNames ?? 0}
              itemsPerPage={itemsPerPage}
              page={options?.page || 1}
              setPage={(value) => {
                updateFilterOptions({ page: value });
              }}
              handleInputChange={debounceFn}
            />
          </FlexCenter>
        </Container>
      )}
    </>
  );
};

export default Names;
