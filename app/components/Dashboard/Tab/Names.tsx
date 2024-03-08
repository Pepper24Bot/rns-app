import React from "react";
import { Box, Grid, styled } from "@mui/material";
import { NameWrapped, useGetNamesByIdQuery } from "@/redux/graphql/hooks";
import { useAccount } from "wagmi";
import { NameCard } from "./Names/NameCard";
import { isEmpty } from "lodash";
import { SecondaryLabel } from "@/components/Theme/StyledGlobal";

const Container = styled(Grid)(({ theme }) => ({
  padding: "35px 0",
}));

const Label = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 700,
}));

const Description = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  marginTop: "8px",
  color: theme.palette.text.secondary,
  fontWeight: 200,
}));

export const Names: React.FC = () => {
  const { address } = useAccount();
  const { data, isLoading } = useGetNamesByIdQuery(
    { id: address?.toLowerCase() || "" },
    { skip: address === null }
  );

  const nameList = data?.nameWrappeds;

  return !isEmpty(nameList) ? (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
          {nameList?.map((name, index) => {
            return (
              <NameCard
                item={name as NameWrapped}
                key={`${name.name}-${index}`}
              />
            );
          })}
        </Grid>
      </Box>
    </Container>
  ) : (
    <Container>
      <Label>No Names found</Label>
      <Description>There is no registered name under your account.</Description>
    </Container>
  );
};

export default Names;
