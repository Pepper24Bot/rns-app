import React, { useEffect, useState } from "react";
import {
  Ranking,
  useLeaderboardState,
} from "@/redux/leaderboard/leaderboardSlice";
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  styled,
  alpha,
  IconButton,
} from "@mui/material";
import {
  ColumnContent,
  Header,
  HighlightValue as StyledHighlightValue,
  Row,
  RowText as StyledRowText,
  Divider as StyledDivider,
  ColumnTitle,
  OwnerContainer,
} from "./StyledLeaderboard";
import {
  Flex,
  Relative,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";
import {
  getExpiry,
  getMaskedAddress,
  pushToCharacters,
  pushToEmojis,
  pushToOneKClub,
  pushToTenKClub,
  sortByClubRank,
  sortByLabel,
} from "@/utils/common";
import { Address, isAddress } from "viem";
import { ArrowBack, ArrowDropDown } from "@mui/icons-material";
import { isEmpty } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { getEnsAddress, getEnsName } from "@wagmi/core";
import { config } from "@/chains/config";

export const ListContainer = styled(Grid)(({ theme }) => ({
  padding: "40px 32px 0 16px",
  [theme.breakpoints.down("md")]: {
    padding: "25px 8px",
  },
}));

export const PanelsContainer = styled(ListContainer)(({ theme }) => ({
  padding: "40px 0 0 32px",
  [theme.breakpoints.down("md")]: {
    padding: "25px 8px",
  },
}));

export const HorizontalDivider = styled(StyledDivider)(({ theme }) => ({
  margin: 0,
}));

export const VerticalDivider = styled(StyledDivider)(({ theme }) => ({
  margin: "-20px 8px",
  borderColor: alpha(theme.palette.primary.dark, 0.5),
}));

export const RowText = styled(StyledRowText)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.5),
}));

export const HeadingTitle = styled(StyledRowText)(({ theme }) => ({
  paddingRight: "8px",
}));

export const HighlightValue = styled(StyledHighlightValue)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    fontSize: "32px", // override
  },
}));

export const TotalNames = styled(RowText)(({ theme }) => ({
  fontSize: "32px",
  textAlign: "center",
  color: theme.palette.text.primary,
}));

export const LabelName = styled(HighlightValue)(({ theme }) => ({
  fontSize: "16px",
  [theme.breakpoints.down("md")]: {
    fontSize: "16px", // override
  },
}));

export const IdentityText = styled(RowText)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const Accordion = styled(MuiAccordion)(({ theme }) => ({
  "&.MuiAccordion-root::before": {
    backgroundColor: "transparent",
  },

  "& .MuiAccordionSummary-root": {
    border: `solid 1px ${alpha(theme.palette.primary.dark, 0.5)}`,
    borderRadius: "4px",
    backgroundColor: theme.palette.background.paper,

    "&.Mui-expanded": {
      borderBottom: "none",
      borderRadius: "4px 4px 0 0",
    },
  },

  "& .MuiCollapse-root": {
    backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${alpha(theme.palette.primary.dark, 0.5)}`,
  },
}));

export const PanelDivider = styled(StyledDivider)(({ theme }) => ({
  margin: 0,
  borderColor: alpha(theme.palette.primary.dark, 0.5),
}));

export const BackButton = styled(IconButton)(({ theme }) => ({
  padding: "6px",
  marginRight: "8px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.35),
}));

export interface SummaryProps {
  totalNames: Ranking[];
  searchAddrOrName: string;
  isFetched?: boolean;
}

export interface SearchedItem extends Ranking {
  rank?: number;
}

export const Summary: React.FC<SummaryProps> = (props: SummaryProps) => {
  const { totalNames, searchAddrOrName, isFetched } = props;

  const pathName = usePathname();
  const router = useRouter();

  const [primaryName, setPrimaryName] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [searchedItem, setSearchedItem] = useState<SearchedItem>({});

  const [singleEmojis, setSingleEmojis] = useState<Ranking[]>([]);
  const [singleCharacters, setSingleCharacters] = useState<Ranking[]>([]);
  const [oneKClub, setOneKClub] = useState<Ranking[]>([]);
  const [tenKClub, setTenKClub] = useState<Ranking[]>([]);

  const { updateSearchNameOrAddr } = useLeaderboardState();

  const isLoading = !isFetched || isSearching;

  const categoies = [
    "Single Emoji",
    "Single Character",
    "999 Club",
    "10K Club",
  ];

  const clearState = () => {
    setSearchedItem({});
    setSingleEmojis([]);
    setSingleCharacters([]);
    setOneKClub([]);
    setTenKClub([]);
    setIsSearching(true);
  };

  const handleBackButton = () => {
    clearState();
    updateSearchNameOrAddr("");
    if (pathName.includes("/summary")) {
      router.push("/leaderboard/top-50", { scroll: false });
    }
  };

  const getRankings = () => {
    if (!isEmpty(searchedItem?.names)) {
      searchedItem.names?.forEach(
        ({ wrappedOwner, labelName, expiryDate }, index) => {
          const item = {
            owner: wrappedOwner?.id,
            label: labelName,
            expiryDate: getExpiry(expiryDate).distance,
          };

          const props = {
            labelName,
            length: labelName.length,
            item,
          };

          pushToEmojis({ ...props, ranks: singleEmojis });
          pushToCharacters({ ...props, ranks: singleCharacters });
          pushToOneKClub({ ...props, ranks: oneKClub });
          pushToTenKClub({ ...props, ranks: tenKClub });
        }
      );

      const sortedChars = sortByLabel(singleCharacters);
      const sortedOneK = sortByClubRank(oneKClub);
      const sortedTenK = sortByClubRank(tenKClub);

      setSingleCharacters([...sortedChars]);
      setOneKClub([...sortedOneK]);
      setTenKClub([...sortedTenK]);
    }
  };

  const getNamesByCategory = (label: string) => {
    switch (label) {
      case "Single Emoji":
        return singleEmojis;
      case "Single Character":
        return singleCharacters;
      case "999 Club":
        return oneKClub;
      case "10K Club":
        return tenKClub;
      default:
        return [];
    }
  };

  const setPrimary = async (address: string) => {
    const primary = await getEnsName(config, { address: address as Address });
    setPrimaryName(primary);
  };

  const findItemByAddr = (address: string) => {
    const index = totalNames?.findIndex((item) => {
      return item.owner === address?.toLowerCase();
    });

    if (index !== -1 && totalNames) {
      return {
        ...totalNames[index!],
        rank: index! + 1,
      };
    }
  };

  const fetchByPrimary = async (name: string) => {
    const address = (await getEnsAddress(config, {
      name: `${name}.root`,
    })) as string;

    if (address) {
      const namesOwnedByAddr = findItemByAddr(address);
      await setPrimary(namesOwnedByAddr?.owner || "");
      setSearchedItem({ ...namesOwnedByAddr });
    }
    setIsSearching(false);
  };

  const fetchByAddress = async (address: string) => {
    const namesOwnedByAddr = findItemByAddr(address);
    await setPrimary(namesOwnedByAddr?.owner || "");
    setSearchedItem({ ...namesOwnedByAddr });
    setIsSearching(false);
  };

  useEffect(() => {
    if (!isEmpty(searchedItem)) {
      getRankings();
    }
  }, [searchedItem]);

  useEffect(() => {
    clearState();

    if (searchAddrOrName) {
      if (isAddress(searchAddrOrName)) {
        fetchByAddress(searchAddrOrName);
      } else {
        fetchByPrimary(searchAddrOrName);
      }
    }
  }, [searchAddrOrName, totalNames]);

  return (
    <Grid>
      <Grid container pt={3}>
        <Grid item xs={12} sm={6}>
          <HorizontalDivider flexItem textAlign="left">
            <Flex>
              <BackButton
                onClick={() => {
                  return handleBackButton();
                }}
              >
                <ArrowBack />
              </BackButton>
              <HeadingTitle>Overall Ranking:</HeadingTitle>
              <Relative>
                <SkeletonTypography isloading={isLoading} />
                <HighlightValue isloading={isLoading}>
                  {searchedItem.rank || "-"}
                </HighlightValue>
              </Relative>
            </Flex>
          </HorizontalDivider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <HorizontalDivider flexItem textAlign="right">
            <Flex>
              <HeadingTitle>Total Identities Owned:</HeadingTitle>
              <Relative>
                <SkeletonTypography isloading={isLoading} />
                <HighlightValue isloading={isLoading}>
                  {searchedItem.names?.length || "0"}
                </HighlightValue>
              </Relative>
            </Flex>
          </HorizontalDivider>
        </Grid>
      </Grid>
      {isFetched && !isSearching && isEmpty(searchedItem) ? (
        <HeadingTitle
          p={4}
        >{`Sorry! ${searchAddrOrName} does not own any identities.`}</HeadingTitle>
      ) : (
        <Grid container>
          <ListContainer item xs={12} md={6}>
            <OwnerContainer mb={2}>
              <Flex>
                <IdentityText pr={1}>Owner:</IdentityText>
                {!isLoading ? (
                  <Flex container>
                    {primaryName && (
                      <Flex pr={1}>
                        <RowText pr={1} isloading={isLoading}>
                          {primaryName}
                        </RowText>
                        <PanelDivider flexItem orientation="vertical" />
                      </Flex>
                    )}
                    <RowText sx={{ wordBreak: "break-all" }}>
                      {searchedItem?.owner}
                    </RowText>
                  </Flex>
                ) : (
                  <Relative item xs={8} pl={2}>
                    <SkeletonTypography isloading={isLoading} />
                    <IdentityText isloading={true}>---</IdentityText>
                  </Relative>
                )}
              </Flex>
            </OwnerContainer>
            <ColumnContent></ColumnContent>
            <Header container>
              <Grid item xs={8}>
                <ColumnTitle>Identity</ColumnTitle>
              </Grid>
              <Grid item xs={4}>
                <ColumnTitle>Expiry</ColumnTitle>
              </Grid>
            </Header>
            <ColumnContent>
              {!isLoading
                ? searchedItem?.names?.map((item) => {
                    return (
                      <Row
                        container
                        key={`summary-identity-${item?.labelName}`}
                      >
                        <Grid item xs={8} pl={2}>
                          <IdentityText>{item?.labelName || "00"}</IdentityText>
                        </Grid>
                        <Grid item xs={4}>
                          <RowText>
                            In {getExpiry(item?.expiryDate).distance}
                          </RowText>
                        </Grid>
                      </Row>
                    );
                  })
                : // skeleton loading only
                  [...Array(5)].map((_, index) => {
                    return (
                      <Row container key={`skeleton-identity-${index}`}>
                        <Relative item xs={8} pl={2}>
                          <SkeletonTypography
                            isloading={isLoading}
                            width="85%"
                          />
                          <IdentityText isloading={true}>000</IdentityText>
                        </Relative>
                        <Relative item xs={4}>
                          <SkeletonTypography
                            isloading={isLoading}
                            width="50%"
                          />
                          <RowText isloading={true}>00-00-00</RowText>
                        </Relative>
                      </Row>
                    );
                  })}
            </ColumnContent>
          </ListContainer>
          <VerticalDivider
            flexItem
            orientation="vertical"
            sx={{ display: { xs: "none", md: "flex" } }}
          />
          <PanelsContainer item xs={12} md={5.5}>
            {categoies.map((label, index) => {
              return (
                <Accordion
                  defaultExpanded
                  key={`ranking-category-${label}-${index}`}
                >
                  <AccordionSummary expandIcon={<ArrowDropDown />}>
                    <ColumnTitle>{label}</ColumnTitle>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: 0 }}>
                    <Flex>
                      {getNamesByCategory(label).length ? (
                        <Flex>
                          <Grid p={2}>
                            <RowText>Total:</RowText>
                            <Relative>
                              <SkeletonTypography isloading={isLoading} />
                              <TotalNames isloading={isLoading}>
                                {getNamesByCategory(label).length}
                              </TotalNames>
                            </Relative>
                          </Grid>
                          <PanelDivider flexItem orientation="vertical" />
                          <Grid container p={2}>
                            {getNamesByCategory(label).map((name, index) => {
                              return (
                                <Flex item key={name.label}>
                                  <Relative>
                                    <SkeletonTypography isloading={isLoading} />
                                    <LabelName isloading={isLoading}>
                                      {name.label}
                                    </LabelName>
                                  </Relative>
                                  {getNamesByCategory(label).length - 1 !==
                                    index && (
                                    <PanelDivider
                                      sx={{ mx: 1 }}
                                      flexItem
                                      orientation="vertical"
                                    />
                                  )}
                                </Flex>
                              );
                            })}
                          </Grid>
                        </Flex>
                      ) : (
                        <RowText p={2}>
                          No names found under this category
                        </RowText>
                      )}
                    </Flex>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </PanelsContainer>
        </Grid>
      )}
    </Grid>
  );
};

export default Summary;
