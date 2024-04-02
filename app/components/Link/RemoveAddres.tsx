import React, { useEffect, useState } from "react";
import { Grid, styled, IconButton, alpha } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexRight,
  ActionButton,
  FlexLeft,
  SecondaryLabel,
  BoxContainer,
  FlexCenter,
  Relative,
  Tip,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/services/utils";
import { KeyboardBackspace } from "@mui/icons-material";
import { FONT_WEIGHT } from "../Theme/Global";
import { Address } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useDispatch } from "react-redux";
import {
  graphqlApi,
  useGetNamesByNameQuery,
} from "@/redux/graphql/graphqlSlice";

import Link from "./Link";
import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";

const ConfirmationLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

const ConfirmationText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Light,
}));

export const RemoveAddress: React.FC<Link> = (props: Link) => {
  const { domain } = props;
  const dispatch = useDispatch();

  const { closeModal } = useModalState();
  const { data: domainData } = useGetNamesByNameQuery(
    { labelName: `${domain?.labelName}` },
    { skip: domain?.name === null }
  );

  // TODO: Clean this!!!
  const linkedAddr =
    domainData?.nameWrappeds[0]?.domain?.resolver?.addr?.id || "";

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isRemovingAddr, setIsRemovingAddr] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  // Removing of Linked Address
  const [removeAddrHash, setRemoveAddrHash] = useState<Address | undefined>(
    undefined
  );
  const [isRemoveAddrError, setIsRemoveAddrError] = useState<boolean>(false);
  const [isRemoveAddrSuccess, setIsRemoveAddrSuccess] =
    useState<boolean>(false);

  const { removeAddress } = useRecords();
  const { data: removeAddrReceipt } = useWaitForTransactionReceipt({
    hash: removeAddrHash,
  });

  const handleRemoveLinkedAddr = async () => {
    console.log("name:: ", domain?.name);
    setIsProgressVisible(true);
    setIsPending(true);

    const { isSuccess, error, data } = await removeAddress({
      name: domain?.name || "",
      resolverAddress: domain?.resolver?.address,
    });

    if (isSuccess) {
      setIsPending(false);
      setRemoveAddrHash(data);
    } else {
      setIsRemoveAddrError(true);
    }
  };

  // TODO: Move this in hook
  useEffect(() => {
    if (removeAddrReceipt?.blockHash) {
      setIsRemoveAddrSuccess(true);
      setIsRemovingAddr(false);
      console.log("receipt:: ", removeAddrReceipt?.blockHash);
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
    }
  }, [removeAddrReceipt?.blockHash]);

  console.log("domain:: ", domainData);

  return (
    <Grid>
      <FlexLeft>
        <IconButton
          onClick={() => {
            // Go back to the previous page
            setIsRemovingAddr(false);
          }}
        >
          <KeyboardBackspace />
        </IconButton>
        <ConfirmationLabel>Confirmation</ConfirmationLabel>
      </FlexLeft>
      <Grid pt={4} pl={1.5}>
        <ConfirmationText pb={4}>
          Are you sure you want to remove the linked address?
        </ConfirmationText>
        <InputField
          label="Linked To / Resolver"
          disabled
          focused
          value={getMaskedAddress(linkedAddr) || "None"}
        />
      </Grid>
      <FlexCenter marginY={2.5}>
        <Relative width="100%">
          <BoxContainer isVisible={isProgressVisible}>
            <ProgressBar
              isError={isRemoveAddrError}
              isPaused={isPending}
              isVisible={isProgressVisible}
              isSuccess={isRemoveAddrSuccess}
            />
          </BoxContainer>
          <FlexCenter>
            <Tip isVisible={isProgressVisible}>View Transaction</Tip>
          </FlexCenter>
        </Relative>
      </FlexCenter>
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
            handleRemoveLinkedAddr();
          }}
        >
          Confirm
        </ActionButton>
      </FlexRight>
    </Grid>
  );
};

export default RemoveAddress;
