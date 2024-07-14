import React, { useCallback, useRef, useState } from "react";
import { Box, Collapse, Grid, styled } from "@mui/material";
import { NameCard } from "./Names/NameCard";
import { FlexCenter, SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { DEFAULT_DEBOUNCE, OrderBy } from "@/constants/components";
import { debounce as _debounce, isEmpty } from "lodash";
import {
  getOrderBy,
  getOrderDirection,
  parseCookie,
  scrollIntoElement,
} from "@/utils/common";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Address } from "viem";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { OrderDirection } from "@/redux/graphql/hooks";
import { useAccount } from "wagmi";
import { NextImage } from "@/components/Search/StyledSearch";
import { ViewContainer, ViewRnsText, ConnectButton } from "./Names/StyledName";
import { useModalState } from "@/redux/modal/modalSlice";
import { DomainResponse } from "@/redux/graphql/graphqlApi";

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

  const { status } = useAccount();
  const { updateFilterOptions, useDashboard } = useDashboardState();
  const { identities, options } = useDashboard();
  const { toggleModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

  // initial values for pagination
  const pageSize = Number(parseCookie("itemsPerPage")) || 50;

  // This is used so the tooltips in each name card will not go beyond the screensize
  const boundingElement = useRef<HTMLDivElement | null>(null);

  const orderBy = getOrderBy(
    OrderBy[options?.orderBy as unknown as keyof typeof OrderBy]
  );

  const orderDirection = getOrderDirection(
    OrderDirection[
      options?.orderDirection as unknown as keyof typeof OrderDirection
    ]
  );

  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  const {
    displayedNames: names,
    isFetching,
    isFetched,
    isError,
    totalNames,
    totalPageCount,
  } = useAllNamesForAddress({
    dashboard: true,
    skip: !hasMounted,
    pagination: {
      page: options?.page,
      pageSize: itemsPerPage,
    },
    filter: {
      address: address || "0x",
      name: options?.name?.toLowerCase(),
    },
    sorting: {
      orderBy,
      orderDirection,
    },
  });

  /** names stored in state */
  const displayedNames = identities?.displayedNames;
  const totalDomainsCount = totalNames || identities?.totalDomains || 0;
  const totalPagesCount = totalPageCount || identities?.totalPageCount || 1;

  // TODO: Why does nextJS clears the api response
  /** get the list from api response or from the state */
  const nameList = names || displayedNames;
  const isConnected = status !== "disconnected"; // this covers reconnecting status

  const isLoadingState =
    (isFetching && !nameList) || (!hasMounted && !nameList) || !nameList; // names is undefined initially

  const hasNoNamesState =
    (isEmpty(names) && isEmpty(displayedNames) && isFetched && !isFetching) ||
    isError;

  const handleDebounceOnChange = (value: number) => {
    if (value > 0 && value <= 1000) {
      updateFilterOptions({ page: 1 });
      setItemsPerPage(value);
      // store in cookies
      document.cookie = `itemsPerPage=${value}; path=/`;

      // Scroll to the top
      scrollIntoElement("My Dashboard-Container");
    }
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  return (
    <>
      {isLoadingState && isConnected && <SkeletonNames />}

      {hasNoNamesState && isConnected && (
        <Container>
          <Label>No Names found</Label>
          <Description>
            There is no registered name under your account.
          </Description>
        </Container>
      )}

      {!isEmpty(nameList) && isConnected && (
        <Container id="Names-Container" ref={boundingElement}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {nameList?.map((name: DomainResponse) => {
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
              pageCount={totalPagesCount}
              totalItemsCount={totalDomainsCount}
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

      <Collapse in={status === "disconnected"}>
        <FlexCenter>
          <ViewContainer>
            <ViewRnsText>View your Identities</ViewRnsText>
            <ConnectButton
              variant="outlined"
              onClick={() => {
                toggleModal({
                  id: "Wallets",
                  isXDisabled: true,
                  title: address ? "Switch Wallet" : "Choose your Wallet",
                });
              }}
            >
              <NextImage
                src="/icons/wallet.svg"
                alt="Wallet Icon"
                width={24}
                height={24}
              />
              Connect Your Wallet
            </ConnectButton>
          </ViewContainer>
        </FlexCenter>
      </Collapse>
    </>
  );
};

export default Names;
