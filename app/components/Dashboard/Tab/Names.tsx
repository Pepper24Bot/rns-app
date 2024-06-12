import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, styled } from "@mui/material";
import { NameCard } from "./Names/NameCard";
import { FlexCenter, SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { debounce as _debounce, isEmpty } from "lodash";
import { parseCookie, scrollIntoElement } from "@/utils/common";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Address } from "viem";

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

  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

  const { names, isLoading, isSuccess, isError } = useNamesForAddress({
    address: address || "0x",
    skip: !hasMounted,
    isFromUrlRouter: true,
  });

  // initial values for pagination
  const itemsPerPageCount = Number(parseCookie("itemsPerPage")) || 50;

  const isLoadingState = (!isSuccess && isLoading) || !hasMounted;
  const hasNoNamesState =
    (isEmpty(names) && isSuccess && !isLoading) || isError;

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageCount);
  const [itemCountField, setItemCountField] = useState(itemsPerPageCount);
  const [pageCount, setPageCount] = useState(1);

  const handleDebounceOnChange = (value: number) => {
    setItemsPerPage(value);
    setPage(1);

    // store in cookies
    document.cookie = `itemsPerPage=${value}; path=/`;

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

  useEffect(() => {
    console.log("hasMounted:: ", hasMounted);
    console.log("isSuccess:: ", isSuccess);
    console.log("isLoading:: ", isLoading);
    console.log("------------------------------------");
  }, [isLoadingState]);

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
        <Container id="Names-Container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {names?.map((name, index) => {
                return (
                  <React.Fragment key={name.name}>
                    {shouldItemShow(index) ? (
                      <NameCard item={name} address={address as Address} />
                    ) : (
                      <></>
                    )}
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
              inputValue={itemCountField}
              page={page}
              setPage={setPage}
              handleInputChange={(value) => {
                if (value) {
                  debounceFn(value);
                  setItemCountField(value);
                }
              }}
            />
          </FlexCenter>
        </Container>
      )}
    </>
  );
};

export default Names;
