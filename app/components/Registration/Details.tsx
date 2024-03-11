import React from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { getExpiration, getMaskedAddress } from "@/services/utils";
import {
  FieldContainer,
  FlexJustified,
  InformationTip,
  ModalInputField as InputField,
  SecondaryLabel,
} from "../Theme/StyledGlobal";

import Image from "next/image";
import { FONT_WEIGHT } from "../Theme/Global";
import { useGetNamesByNameQuery } from "@/redux/graphql/hooks";
import { useDomainState } from "@/redux/domain/domainSlice";

const ImageContainer = styled(Grid)(({ theme }) => ({
  paddingRight: "30px",
}));

const NameContainer = styled(FieldContainer)(({ theme }) => ({
  marginTop: 0,
  maxWidth: "350px",
}));

const Label = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: FONT_WEIGHT.Light,
}));

const RegisteredLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.primary.main,
}));

export const Details: React.FC = () => {
  const { useDomain } = useDomainState();
  const { name } = useDomain();

  const { data, isLoading } = useGetNamesByNameQuery(
    { labelName: `${name}` },
    { skip: name === null }
  );

  const details = data?.nameWrappeds[0];

  return (
    <Grid container mt={6} minWidth={300}>
      <ImageContainer item>
        <Image
          src="/images/rns-image-placeholder.svg"
          alt="Wallet Icon"
          width={290}
          height={200}
          style={{
            height: "fit-content",
            border: `solid 1px ${alpha(grey[50], 0.25)}`,
            borderRadius: "4px",
            boxShadow: `0px 0px 15px 0px ${darken(grey[900], 1)}`,
          }}
        />
      </ImageContainer>
      <Grid item maxWidth={350}>
        <NameContainer>
          <Grid>
            <Label>{details?.domain.name}</Label>
            <RegisteredLabel>Registered</RegisteredLabel>
          </Grid>
          <Grid>
            <InformationTip title="View on secondary marketplace." arrow>
              <Image
                src="/icons/marketplace.svg"
                alt="MarketPlace Icon"
                width={36}
                height={36}
                style={{ marginLeft: "20px", cursor: "pointer" }}
              />
            </InformationTip>
          </Grid>
        </NameContainer>
        <InputField
          label="Owner"
          disabled
          focused
          value={getMaskedAddress(String(details?.owner.id || ""))}
        />
        <InputField
          label="Expiry"
          disabled
          focused
          value={getExpiration(details?.domain.createdAt).expiration}
          InputProps={{
            inputComponent: () => {
              // TODO: Fix warning here: React.forwardRef
              return (
                <FlexJustified width="100%">
                  <Label>
                    {getExpiration(details?.domain.createdAt).expiration}
                  </Label>
                  <Label>
                    {`In ${
                      getExpiration(details?.domain.createdAt)
                        .distanceToExpiration
                    }`}
                  </Label>
                </FlexJustified>
              );
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Details;
