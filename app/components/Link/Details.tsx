import React, { useEffect, useState } from "react";
import { Grid, styled, IconButton, alpha } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexRight,
  ActionButton,
  Flex,
  FlexLeft,
  SecondaryLabel,
  BoxContainer,
  FlexCenter,
  Relative,
  Tip,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress, isAddressFuturePass } from "@/services/utils";
import {
  CheckCircle,
  Close,
  Edit,
  KeyboardBackspace,
} from "@mui/icons-material";
import Link from "./Link";
import { green } from "@mui/material/colors";
import { FONT_WEIGHT } from "../Theme/Global";
import { Address } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import { useDispatch } from "react-redux";
import {
  graphqlApi,
  useGetNamesByNameQuery,
} from "@/redux/graphql/graphqlSlice";

const ResolverButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButton-contained": {
    border: "none",
    borderRadius: "4px",
    backgroundColor: theme.palette.primary.dark,
    padding: "8px",

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.dark, 0.5),
    },
  },
}));

const CheckedIcon = styled(CheckCircle)(({ theme }) => ({
  color: green[500],
  width: "24px",
  height: "24px",
  position: "absolute",
  top: "-8px",
  right: "-8px",
  zIndex: 2,
}));

const ConfirmationLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

const ConfirmationText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Light,
}));

const EditIcon = styled(Edit)(({ theme }) => ({}));

const CloseIcon = styled(Close)(({ theme }) => ({}));

export const Details: React.FC<Link> = (props: Link) => {
  const { domain, owner } = props;
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

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  // Updating of Linked Address
  const [isUpdateAddrEnabled, setIsUpdateAddrEnabled] =
    useState<boolean>(false);
  const [inputValue, setInputResolver] = useState<string>(
    getMaskedAddress(linkedAddr) || "None"
  );
  const [updateAddrHash, setUpdateAddrHash] = useState<Address | undefined>(
    undefined
  );
  const [isUpdateAddrError, setIsUpdateAddrError] = useState<boolean>(false);
  const [isUpdateAddrSuccess, setIsUpdateAddrSuccess] =
    useState<boolean>(false);

  // Removing of Linked Address
  const [isRemovingAddr, setIsRemovingAddr] = useState<boolean>(false);
  const [removeAddrHash, setRemoveAddrHash] = useState<Address | undefined>(
    undefined
  );
  const [isRemoveAddrError, setIsRemoveAddrError] = useState<boolean>(false);
  const [isRemoveAddrSuccess, setIsRemoveAddrSuccess] =
    useState<boolean>(false);

  const { removeAddress, setAddressRecord } = useRecords();

  const { data: removeAddrReceipt } = useWaitForTransactionReceipt({
    hash: removeAddrHash,
  });

  const { data: updateAddrReceipt } = useWaitForTransactionReceipt({
    hash: updateAddrHash,
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

  const handleSetFuturePass = async () => {
    const isValid = isAddressFuturePass(inputValue);

    if (inputValue && isValid) {
      setIsProgressVisible(true);
      setIsPending(true);

      const { isSuccess, error, data } = await setAddressRecord({
        name: domain?.name || "",
        futurePassAddress: inputValue as Address,
        resolverAddress: domain?.resolver?.address,
      });

      if (isSuccess) {
        setIsPending(false);
        setUpdateAddrHash(data);
      } else {
        setIsUpdateAddrError(true);
      }
    }
  };

  useEffect(() => {
    if (updateAddrReceipt?.blockHash) {
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsUpdateAddrSuccess(true);
      closeModal();
    }
  }, [updateAddrReceipt?.blockHash]);

  // TODO: Move this in hook
  useEffect(() => {
    if (removeAddrReceipt?.blockHash) {
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsRemoveAddrSuccess(true);
      setIsRemovingAddr(false);
      console.log("receipt:: ", removeAddrReceipt?.blockHash);
    }
  }, [removeAddrReceipt?.blockHash]);

  return (
    <Grid item xs>
      {!isRemovingAddr ? (
        <Grid>
          <InputField disabled value={domain?.name} />
          <InputField
            label="Owner"
            disabled
            focused
            value={getMaskedAddress(String(owner?.id || ""))}
            InputProps={{
              endAdornment: <CheckedIcon />,
            }}
          />
          <InputField
            label="Linked To / Resolver"
            value={inputValue}
            focused
            //   TODO: component is not reloading when the state is changing
            //   disabled={isResolverEnabled}
            onChange={(event) => {
              const { value } = event.target;
              if (isUpdateAddrEnabled) {
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
                      setIsUpdateAddrEnabled(!isUpdateAddrEnabled);
                    }}
                  >
                    <EditIcon />
                  </ResolverButton>
                  <ResolverButton
                    disabled={isUpdateAddrEnabled}
                    variant="contained"
                    onClick={() => {
                      setIsRemovingAddr(true);
                    }}
                  >
                    <CloseIcon />
                  </ResolverButton>
                </Flex>
              ),
            }}
          />
          <FlexCenter marginY={1.5}>
            <Relative width="100%">
              <BoxContainer isVisible={isProgressVisible}>
                <ProgressBar
                  isError={isUpdateAddrError}
                  isPaused={isPending}
                  isVisible={isProgressVisible}
                  isSuccess={isUpdateAddrSuccess}
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
              disabled={inputValue === linkedAddr}
              variant="contained"
              onClick={() => {
                handleSetFuturePass();
              }}
            >
              Confirm
            </ActionButton>
          </FlexRight>
        </Grid>
      ) : (
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
      )}
    </Grid>
  );
};

export default Details;
