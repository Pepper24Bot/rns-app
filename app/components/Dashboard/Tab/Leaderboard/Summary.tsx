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
} from "./StyledLeaderboard";
import {
  Flex,
  Relative,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";
import {
  getExpiry,
  pushToCharacters,
  pushToEmojis,
  pushToOneKClub,
  pushToTenKClub,
  sortByClubRank,
  sortByLabel,
} from "@/utils/common";
import { isAddress } from "viem";
import { ArrowBack, ArrowDropDown } from "@mui/icons-material";
import { isEmpty } from "lodash";
import { usePathname, useRouter } from "next/navigation";

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
  [theme.breakpoints.down("md")]: {
    fontSize: "32px", // override
  },
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

export const AccordionDivider = styled(StyledDivider)(({ theme }) => ({
  margin: 0,
  borderColor: alpha(theme.palette.primary.dark, 0.5),
}));

export const BackButton = styled(IconButton)(({ theme }) => ({
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

  const [searchedItem, setSearchedItem] = useState<SearchedItem>({});
  const [singleEmojis, setSingleEmojis] = useState<Ranking[]>([]);
  const [singleCharacters, setSingleCharacters] = useState<Ranking[]>([]);
  const [oneKClub, setOneKClub] = useState<Ranking[]>([]);
  const [tenKClub, setTenKClub] = useState<Ranking[]>([]);

  const { updateSearchNameOrAddr } = useLeaderboardState();

  const categoies = [
    "Single Emoji",
    "Single Character",
    "999 Club",
    "10K Club",
  ];

  const findItemByAddr = () => {
    const index = totalNames?.findIndex((item) => {
      return item.owner === searchAddrOrName?.toLowerCase();
    });

    if (index !== -1 && totalNames) {
      return {
        ...totalNames[index!],
        rank: index! + 1,
      };
    }
  };

  const handleBackButton = () => {
    updateSearchNameOrAddr("");
    if (pathName.includes("/summary")) {
      router.push("/leaderboard/top-50", { scroll: false });
    }
  };

  useEffect(() => {
    if (!isEmpty(searchedItem?.names)) {
      console.log("searchedItem:: ", searchedItem);
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
  }, [searchedItem]);

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

  useEffect(() => {
    // console.log("totalNames:: ", totalNames);
    // console.log("searchAddrOrName:: ", searchAddrOrName);

    if (searchAddrOrName) {
      if (isAddress(searchAddrOrName)) {
        const namesOwnedByAddr = findItemByAddr();
        // console.log("namesOwnedByAddr:: ", namesOwnedByAddr);
        setSearchedItem({ ...namesOwnedByAddr });
      } else {
      }
    }
  }, [searchAddrOrName, totalNames]);
  // 0x03E53414a65AF0723D8dAb6dFBA768E061E5d81f

  return (
    <Grid>
      <Grid container pt={3}>
        <Grid item xs={6}>
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
                <SkeletonTypography isloading={!isFetched} />
                <HighlightValue isloading={!isFetched}>
                  {searchedItem.rank || "00"}
                </HighlightValue>
              </Relative>
            </Flex>
          </HorizontalDivider>
        </Grid>
        <Grid item xs={6}>
          <HorizontalDivider flexItem textAlign="right">
            <Flex>
              <HeadingTitle>Total Identities Owned:</HeadingTitle>
              <Relative>
                <SkeletonTypography isloading={!isFetched} />
                <HighlightValue isloading={!isFetched}>
                  {searchedItem.names?.length || "000"}
                </HighlightValue>
              </Relative>
            </Flex>
          </HorizontalDivider>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6} pt={5} pl={2} pr={4}>
          <Header container>
            <Grid item xs={8}>
              <ColumnTitle>Identity</ColumnTitle>
            </Grid>
            <Grid item xs={4}>
              <ColumnTitle>Expiry</ColumnTitle>
            </Grid>
          </Header>
          <ColumnContent>
            {isFetched
              ? searchedItem?.names?.map((item) => {
                  return (
                    <Row container key={`summary-identity-${item?.labelName}`}>
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
                          isloading={!isFetched}
                          width="85%"
                        />
                        <IdentityText isloading={true}>000</IdentityText>
                      </Relative>
                      <Relative item xs={4}>
                        <SkeletonTypography
                          isloading={!isFetched}
                          width="50%"
                        />
                        <RowText isloading={true}>00-00-00</RowText>
                      </Relative>
                    </Row>
                  );
                })}
          </ColumnContent>
        </Grid>
        <VerticalDivider flexItem orientation="vertical" />
        <Grid item xs={5.5} pl={4} pt={5}>
          {categoies.map((label) => {
            return (
              <Accordion defaultExpanded key={`ranking-category-${label}`}>
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
                            <SkeletonTypography isloading={!isFetched} />
                            <TotalNames isloading={!isFetched}>
                              {getNamesByCategory(label).length}
                            </TotalNames>
                          </Relative>
                        </Grid>
                        <AccordionDivider flexItem orientation="vertical" />
                        <Grid container p={2}>
                          {getNamesByCategory(label).map((name, index) => {
                            return (
                              <Flex item key={name.label}>
                                <Relative>
                                  <SkeletonTypography isloading={!isFetched} />
                                  <LabelName isloading={!isFetched}>
                                    {name.label}
                                  </LabelName>
                                </Relative>
                                {getNamesByCategory(label).length - 1 !==
                                  index && (
                                  <AccordionDivider
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
