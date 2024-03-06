import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, styled } from "@mui/material";
import {
  InputField as StyledInputField,
  FlexRight,
  ActionButton,
  Flex,
} from "../Theme/StyledGlobal";
import { useDomainState } from "@/redux/domain/domainSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/services/utils";
import { Close, Edit } from "@mui/icons-material";
import useLinkName from "@/hooks/useLinkName";

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

const ResolverButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButton-contained": {
    border: "none",
    borderRadius: "4px",
    backgroundColor: theme.palette.primary.dark,
    padding: "8px",
  },
}));

const EditIcon = styled(Edit)(({ theme }) => ({}));

const CloseIcon = styled(Close)(({ theme }) => ({}));

export const Details: React.FC = () => {
  const { closeModal } = useModalState();
  const { useDomain } = useDomainState();
  const { name = "" } = useDomain();
  const { owner, resolver } = useLinkName({
    name,
  });

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isDeletingResolver, setIsDeletingResolver] = useState<boolean>(false);
  const [isResolverEnabled, setIsResolverEnabled] = useState<boolean>(false);

  const [inputValue, setInputResolver] = useState<string>(resolver || "");

  const handleUpdateResolver = async () => {
    // TODO: implement edit resolver
  };

  const handleRemoveResolver = async () => {
    // TODO: remove resolver
  };

  useEffect(() => {
    if (resolver) {
      setInputResolver(resolver);
    }
  }, [resolver]);

  return (
    <Grid item xs>
      <Grid maxWidth={350}>
        <InputField disabled value={name} />
        <InputField
          label="Owner"
          disabled
          focused
          value={getMaskedAddress(String(owner))}
        />
        <InputField
          label="Linked To / Resolver"
          value={
            isResolverEnabled
              ? inputValue
              : getMaskedAddress(String(inputValue))
          }
          focused
          //   TODO: component is not reloading when the state is changing
          //   disabled={isResolverEnabled}
          onChange={(event) => {
            const { value } = event.target;
            if (isResolverEnabled) {
              setInputResolver(value);
            }
          }}
          InputProps={{
            endAdornment: (
              <Flex>
                <ResolverButton
                  sx={{ marginRight: 1 }}
                  variant="contained"
                  onClick={() => {
                    setIsResolverEnabled(!isResolverEnabled);
                    handleUpdateResolver();
                  }}
                >
                  <EditIcon />
                </ResolverButton>
                <ResolverButton
                  variant="contained"
                  onClick={() => {
                    setIsDeletingResolver(true);
                    handleRemoveResolver();
                  }}
                >
                  <CloseIcon />
                </ResolverButton>
              </Flex>
            ),
          }}
        />
      </Grid>
      {isDeletingResolver && (
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
                handleRemoveResolver();
              }}
            >
              {isPending && (
                <CircularProgress color="secondary" size={18} sx={{ ml: 1 }} />
              )}
              Confirm
            </ActionButton>
          </FlexRight>
        </Grid>
      )}
    </Grid>
  );
};

export default Details;
