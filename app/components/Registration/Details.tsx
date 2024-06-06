import React, { useEffect } from "react";
import { Grid, styled } from "@mui/material";
import { getExpiration, getMaskedAddress } from "@/utils/common";
import {
  FieldContainer,
  FlexCenter,
  InformationTip,
  Label,
  ModalInputField,
  Relative,
  SecondaryLabel,
  SkeletonTypography,
  Value,
} from "../Theme/StyledGlobal";
import { WrappedDomain } from "@/redux/graphql/hooks";

import Image from "next/image";
import EnsImage from "../Reusables/EnsImage";

const DetailsContainer = styled(FlexCenter)(({ theme }) => ({
  alignItems: "start",

  [theme.breakpoints.up(710)]: {
    maxWidth: "350px",
  },

  [theme.breakpoints.down(600)]: {
    width: "100%",
  },
}));

const InputField = styled(ModalInputField)(({ theme }) => ({}));

const Field = styled(FieldContainer)(({ theme }) => ({
  marginTop: 0,
  marginBottom: "12px",
}));

const RegisteredLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.primary.main,
}));

interface DetailsProps {
  name?: string;
  domain?: Partial<WrappedDomain>;
  isSuccess?: boolean;
}

export const Details: React.FC<DetailsProps> = (props: DetailsProps) => {
  const { name, domain, isSuccess = true } = props;
  const details = domain;

  const { expiration, distanceToExpiration } = getExpiration(
    details?.domain?.createdAt,
    details?.domain?.expiryDate
  );

  return (
    <Grid container mt={6} minWidth={250}>
      <EnsImage name={name} />
      <DetailsContainer item>
        <Grid>
          <Field>
            <Grid>
              <Value>{name}</Value>
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
          </Field>
          <InputField
            label="Owner"
            disabled
            focused
            value=""
            // Dirty - utilize start adornment - feeling lazy to do forwardRef
            InputProps={{
              startAdornment: (
                <Relative minWidth={150}>
                  <SkeletonTypography isloading={!details?.owner?.id} />
                  <Value isloading={!details?.owner?.id}>
                    {getMaskedAddress(String(details?.owner?.id || ""))}
                  </Value>
                </Relative>
              ),
            }}
          />
          <InputField
            label="Expiry"
            disabled
            focused
            value=""
            // Dirty - utilize start adornment - feeling lazy to do forwardRef
            InputProps={{
              startAdornment: (
                <Relative minWidth={150}>
                  <SkeletonTypography isloading={!isSuccess} />
                  <Value isloading={!isSuccess}>
                    {expiration || "00-00-0000"}
                  </Value>
                </Relative>
              ),
              endAdornment: (
                <Relative minWidth={75}>
                  <SkeletonTypography isloading={!isSuccess} />
                  <Label
                    isloading={!isSuccess}
                  >{`In ${distanceToExpiration}`}</Label>
                </Relative>
              ),
            }}
          />
        </Grid>
      </DetailsContainer>
    </Grid>
  );
};

export default Details;
