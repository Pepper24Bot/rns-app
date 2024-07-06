import React, { useEffect, useState } from "react";
import { Ranking } from "@/redux/leaderboard/leaderboardSlice";
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  styled,
  Typography,
  alpha,
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
import { getExpiry } from "@/utils/common";
import { isAddress } from "viem";
import { ArrowDropDown } from "@mui/icons-material";

export const HorizontalDivider = styled(StyledDivider)(({ theme }) => ({
  //   margin: "16px",
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
  [theme.breakpoints.down("md")]: {
    fontSize: "32px", // override
  },
}));

export const HighlightValue = styled(StyledHighlightValue)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    fontSize: "32px", // override
  },
}));

export const Accordion = styled(MuiAccordion)(({ theme }) => ({
  "& .MuiAccordionSummary-root": {
    border: `solid 1px ${theme.palette.primary.dark}`,
    borderRadius: "4px",
    backgroundColor: theme.palette.background.paper,

    "&.Mui-expanded": {
      borderBottom: "none",
      borderRadius: "4px 4px 0 0",
    },
  },

  "& .MuiCollapse-root": {
    backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${theme.palette.primary.dark}`,
  },
}));

export interface SummaryProps {
  totalNames: Ranking[];
  searchAddrOrName: string;
}

export const Summary: React.FC<SummaryProps> = (props: SummaryProps) => {
  const { totalNames, searchAddrOrName } = props;

  const [searchedItem, setSearchedItem] = useState<Ranking & { rank?: number }>(
    {}
  );

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

  useEffect(() => {
    console.log("totalNames:: ", totalNames);
    console.log("searchAddrOrName:: ", searchAddrOrName);

    if (searchAddrOrName) {
      if (isAddress(searchAddrOrName)) {
        const namesOwnedByAddr = findItemByAddr();
        console.log("namesOwnedByAddr:: ", namesOwnedByAddr);
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
              <HeadingTitle pr={1}>Overall Ranking:</HeadingTitle>
              <Relative>
                <SkeletonTypography isloading={false} />
                <HighlightValue isloading={false}>
                  {searchedItem.rank}
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
                <SkeletonTypography isloading={false} />
                <HighlightValue isloading={false}>
                  {searchedItem.names?.length}
                </HighlightValue>
              </Relative>
            </Flex>
          </HorizontalDivider>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6} pt={5} pl={2} pr={4}>
          <Header container>
            <Grid item xs={6}>
              <ColumnTitle>Identity</ColumnTitle>
            </Grid>
            <Grid item xs={6}>
              <ColumnTitle>Expiry</ColumnTitle>
            </Grid>
          </Header>
          <ColumnContent>
            {searchedItem.names?.map((item) => {
              return (
                <Row container key={`summary-identity-${item.labelName}`}>
                  <Relative item xs={6} pl={2}>
                    <SkeletonTypography isloading={false} width="85%" />
                    <RowText isloading={false}>{item.labelName}</RowText>
                  </Relative>
                  <Relative item xs={6}>
                    <SkeletonTypography isloading={false} width="50%" />
                    <RowText isloading={false}>
                      In {getExpiry(item.expiryDate).distance}
                    </RowText>
                  </Relative>
                </Row>
              );
            })}
          </ColumnContent>
        </Grid>
        <VerticalDivider flexItem orientation="vertical" />
        <Grid item xs={5.5} pl={4} pt={5}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDropDown />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <ColumnTitle>Single Emoji</ColumnTitle>
            </AccordionSummary>
            <AccordionDetails>
              <RowText>
                TODO: Add names here under single emoji category
              </RowText>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDropDown />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <ColumnTitle>Single Character</ColumnTitle>
            </AccordionSummary>
            <AccordionDetails>
              <RowText>
                TODO: Add names here under single emoji category
              </RowText>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDropDown />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <ColumnTitle>999 Club</ColumnTitle>
            </AccordionSummary>
            <AccordionDetails>
              <RowText>
                TODO: Add names here under single emoji category
              </RowText>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDropDown />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <ColumnTitle>10K Club</ColumnTitle>
            </AccordionSummary>
            <AccordionDetails>
              <RowText>
                TODO: Add names here under single emoji category
              </RowText>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
