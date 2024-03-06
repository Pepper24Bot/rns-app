import React, { useCallback, useState } from "react";
import { Grid, alpha, darken, CircularProgress, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  FlexRight,
  ActionButton,
  InputField as StyledInputField,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { useDomainState } from "@/redux/domain/domainSlice";
import { Address } from "viem";
import Image from "next/image";
import useLinkName from "@/hooks/useLinkName";

const ImageContainer = styled(Grid)(({ theme }) => ({
  paddingRight: "30px",
}));

const InputField = styled(StyledInputField)(({ theme }) => ({
  ".MuiInputBase-root": {
    "&.MuiOutlinedInput-root": {
      fontSize: "16px",
      fontWeight: 200,
      padding: "16px 25px",
      color: theme.palette.text.primary,
    },
  },
  maxWidth: "350px",

  "&:not(:first-of-type)": {
    marginTop: "20px",
  },
}));

export const Link: React.FC = () => {
  const { closeModal } = useModalState();
  const { useDomain } = useDomainState();
  const { name = "" } = useDomain();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [futurePassAddr, setFuturePassAddr] = useState<string>("");

  const { setOwner, owner, resolver } = useLinkName({
    name,
  });

  const handleLinkName = async () => {
    setIsPending(true);

    const { isSuccess, error } = await setOwner({
      name,
      address: futurePassAddr as Address,
    });

    if (isSuccess) {
      closeModal();
    }

    setIsPending(false);
  };

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
      <Grid item xs>
        <Grid maxWidth={350}>
          <InputField disabled value={name} />
          <InputField
            label="FuturePass Address"
            placeholder="Enter FuturePass Address"
            focused
            value={futurePassAddr}
            onChange={(event) => {
              const { value } = event.target;
              setFuturePassAddr(value);
            }}
          />
        </Grid>
        <Grid mt={3}>
          <FlexRight>
            <ActionButton
              sx={{ marginRight: 1 }}
              variant="text"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </ActionButton>
            <ActionButton
              variant="contained"
              onClick={() => {
                handleLinkName();
              }}
            >
              {isPending && (
                <CircularProgress color="secondary" size={18} sx={{ ml: 1 }} />
              )}
              Confirm
            </ActionButton>
          </FlexRight>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Link;
