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
import { GetNamesForAddressReturnType } from "@ensdomains/ensjs/subgraph";

import SkeletonNames from "./Names/SkeletonNames";
import Pagination from "@/components/Reusables/Pagination";
import useNamesForAddress from "@/hooks/useNamesForAddress";

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

  const { useFilters } = useDashboardState();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

  const options = useFilters();

  // initial values for pagination
  const pageSize = Number(parseCookie("itemsPerPage")) || 50;

  // This is used so the tooltips in each name card will not go beyond the screensize
  const boundingElement = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [pageCount, setPageCount] = useState(1);
  const [previousPage, setPreviousPage] =
    useState<GetNamesForAddressReturnType>([]);

  const { names, isLoading, isSuccess, isError, totalNames } =
    useNamesForAddress({
      skip: !hasMounted,
      enableAggregated: true,
      address: address || "0x",
      orderBy: getOrderBy(options?.orderBy),
      orderDirection: getOrderDirection(options?.orderDirection),
      pageSize: itemsPerPage,
      previousPage,
      filter: {
        searchType: "name",
        searchString: options?.name,
        allowExpired: getIsAllowedExpired(options?.allowExpired),
      },
    });

  const isLoadingState = (!isSuccess && isLoading) || !hasMounted;
  const hasNoNamesState =
    (isEmpty(names) && isSuccess && !isLoading) || isError;

  const handleDebounceOnChange = (value: number) => {
    if (value > 0 && value <= 1000) {
      setItemsPerPage(value);
      setPage(1);

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

  const getNumberOfPages = () => {
    return Math.ceil(totalNames / itemsPerPage);
  };

  useEffect(() => {
    const count = getNumberOfPages();
    setPageCount(count);
  }, [totalNames, itemsPerPage]);

  useEffect(() => {
    // console.log("hasMounted:: ", hasMounted);
    // console.log("isSuccess:: ", isSuccess);
    // console.log("isLoading:: ", isLoading);
    // console.log("------------------------------------");
    // console.log("names:: ", names);
    // setNamesList([...names]);
  }, [names]);

  return (
    <>
      {/* TODO: Clean this skeleton up - looks really ugly */}
      {isLoadingState && <SkeletonNames count={2} />}

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
              totalItemsCount={names?.length || 0}
              itemsPerPage={itemsPerPage}
              page={page}
              setPage={(value) => {
                setPreviousPage(names);
                setPage(value);
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
