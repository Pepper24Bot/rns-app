import React, { useEffect, useState } from "react";
import { Ranking } from "@/redux/leaderboard/leaderboardSlice";
import { Divider, Grid } from "@mui/material";
import { Header, Row, RowText } from "./StyledLeaderboard";
import { Relative, SkeletonTypography } from "@/components/Theme/StyledGlobal";
import { getExpiry } from "@/utils/common";
import { isAddress } from "viem";

export interface SummaryProps {
  totalNames: Ranking[];
  searchAddrOrName: string;
}

export const Summary: React.FC<SummaryProps> = (props: SummaryProps) => {
  const { totalNames, searchAddrOrName } = props;

  const [searchedItem, setSearchedItem] = useState<Ranking>({});

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

  return (
    <Grid>
      <Grid container>
        <Grid item xs={6}>
          <Header container>
            <Grid item xs={6}>
              Identity
            </Grid>
            <Grid item xs={6}>
              Expiry
            </Grid>
          </Header>
          {searchedItem.names?.map((item) => {
            return (
              <Row container key={`summary-identity-${item.labelName}`}>
                <Relative item xs={6}>
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
        </Grid>
        <Divider orientation="vertical" />
        <Grid item xs={6}>
          {/* Add collapsible panels here */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
