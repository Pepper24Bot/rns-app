import React, { useEffect } from "react";
import { Grid, styled } from "@mui/material";
import { getExpiration, getMaskedAddress } from "@/utils/common";
import {
  FieldContainer,
  FlexCenter,
  InformationTip,
  ModalInputField,
  Relative,
  SecondaryLabel,
  SkeletonTypography,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { NameStatus } from "@/redux/domain/domainSlice";
import { useGetNamesByIdAndNameQuery } from "@/redux/graphql/graphqlApi";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useModalState } from "@/redux/modal/modalSlice";

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

const Label = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: FONT_WEIGHT.Light,
  width: "max-content",
}));

const Value = styled(Label)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
}));

const RegisteredLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.primary.main,
}));

interface DetailsProps {
  name: string;
  status?: NameStatus;
}

export const Details: React.FC<DetailsProps> = (props: DetailsProps) => {
  const { name } = props;

  const router = useRouter();

  const { closeModal } = useModalState();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const { data, isSuccess } = useGetNamesByIdAndNameQuery(
    { name: `${name}`, id: root?.address?.toLowerCase() || "0x" },
    { skip: name === null || isEmpty(root?.address) }
  );

  const details = data?.wrappedDomains[0];

  const { expiration, distanceToExpiration } = getExpiration(
    details?.domain.createdAt,
    details?.domain.expiryDate
  );

  useEffect(() => {
    if (isSuccess && isEmpty(data?.wrappedDomains)) {
      closeModal();
      router.push("/");
    }
  }, [data, isSuccess]);

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
                  <SkeletonTypography isloading={!root.address} />
                  <Value isloading={!root.address}>
                    {getMaskedAddress(String(root.address || ""))}
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
