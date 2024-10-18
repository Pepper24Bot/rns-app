import { useEffect, useMemo, useState } from "react";
import { Collapse, Grid, styled, alpha, IconButton } from "@mui/material";
import {
	ActionButton,
	Flex,
	FlexCenter,
	FlexLeft,
	FlexRight,
	ModalInputField as InputField,
	Relative,
	SecondaryLabel,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { useEnsName } from "wagmi";
import { isInGracePeriod } from "@/utils/common";
import { debounce as _debounce } from "lodash";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

import EnsImage from "../Reusables/EnsImage";
import ProgressBar from "../Reusables/ProgressBar";
import ViewTransaction from "../Reusables/ViewTransaction";
import useSetContentRecord from "@/hooks/useSetContentRecord";
import useBlockLatency from "@/hooks/useBlockLatency";
import EndAdornment from "../Reusables/EndAdornment";
import GracePeriodTip from "../Reusables/GracePeriodTip";
import type { DomainResponse } from "@/redux/graphql/graphqlApi";
import { hexToString, toHex, type Address } from "viem";
import { Close, Edit, KeyboardBackspace } from "@mui/icons-material";

const TransferContainer = styled(Grid)(({ theme }) => ({
	marginTop: "48px",
	minWidth: "250px",
	maxHeight: "75vh",
	overflow: "overlay",
}));

const FormContainer = styled(Grid)(({ theme }) => ({
	maxWidth: "350px",
	paddingBottom: "16px",

	[theme.breakpoints.down(710)]: {
		maxWidth: "100%",
		width: "100%",
	},
}));

const Note = styled(SecondaryLabel)(({ theme }) => ({
	fontSize: "12px",
	color: alpha(theme.palette.text.primary, 0.35),
}));

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

const ConfirmationLabel = styled(SecondaryLabel)(({ theme }) => ({
	fontSize: "24px",
	color: alpha(theme.palette.text.primary, 0.5),
	paddingLeft: "15px",
}));

interface ContentProps {
	item: DomainResponse;
	address: Address;
	contentHash: Address;
}

export const SetContentRecord: React.FC<ContentProps> = (
	props: ContentProps,
) => {
	const router = useRouter();

	const { address, item, contentHash: originalContentHash } = props;

	const doesContentExist = useMemo(
		() => originalContentHash && originalContentHash !== "0x",
		[originalContentHash],
	);
	const { name, expiryDate, gracePeriod } = item;

	const { closeModal } = useModalState();
	const { enqueueSnackbar } = useSnackbar();

	const { refetch: refetchEnsName, data: ensName } = useEnsName({
		address,
	});

	// Transaction status
	const [isPending, setIsPending] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

	const [isWatchingContent, setWatchContent] = useState<boolean>(false);

	const [txHash, setTxHash] = useState<string>("");

	const [draftContentHash, setDraftContentHash] = useState(
		doesContentExist ? hexToString(originalContentHash) : "",
	);

	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [isPrompt, setIsPrompt] = useState(!doesContentExist);

	const { setContentRecord, isLoading: isSettingContentLoading } =
		useSetContentRecord();

	const { isWaiting: isSettingContent, isCompleted: isContentSet } =
		useBlockLatency({
			enabled: isWatchingContent,
		});

	const isTransactionLoading = isSettingContentLoading || isSettingContent;

	const inGracePeriod = isInGracePeriod(gracePeriod);

	const initializeFlags = () => {
		// display progress bar
		setIsPending(true);
		setIsProgressVisible(true);
		// in case the user rejected the transaction, reset the error status
		setIsError(false);
		setIsSuccess(false);
	};

	const handleSetContent = async () => {
		if (!name) return;

		initializeFlags();
		const { data, isSuccess } = await setContentRecord({
			name,
			content: isDeleting ? toHex(0) : draftContentHash,
		});

		if (isSuccess) {
			setWatchContent(true);
			setTxHash(data.hash);
		} else {
			setIsError(true);
			setIsPending(false);
		}
	};

	useEffect(() => {
		if (!originalContentHash || originalContentHash === "0x") return;
		setDraftContentHash(hexToString(originalContentHash));
	}, [originalContentHash]);

	useEffect(() => {
		if (doesContentExist) setIsPrompt(isEditing || isDeleting);
	}, [isDeleting, isEditing, doesContentExist]);

	useEffect(() => {
		if (isContentSet) {
			enqueueSnackbar(
				`You have successfully set ${name}'s content record to ${draftContentHash}!`,
				{ variant: "success" },
			);

			// Refetch the ens name so that the toolbar will update the primary name
			setIsSuccess(true);
			setIsPending(false);
		}
	}, [draftContentHash, isContentSet, enqueueSnackbar, name]);

	return (
		<Grid>
			<TransferContainer container>
				<EnsImage name={name ?? ""} />
				<FormContainer>
					{isDeleting && (
						<>
							<FlexLeft>
								<IconButton
									disabled={isTransactionLoading || isPending || isSuccess}
									onClick={() => {
										// Go back to the previous page
										setIsProgressVisible(false);
										setIsDeleting(false);
									}}
								>
									<KeyboardBackspace />
								</IconButton>
								<ConfirmationLabel>Confirmation</ConfirmationLabel>
							</FlexLeft>
							<Note pt={4} pb={2}>
								Are you sure you want to remove the content record?
							</Note>
						</>
					)}
					{inGracePeriod && (
						<GracePeriodTip
							expiryDate={expiryDate}
							gracePeriod={gracePeriod}
							content="Extend the expiry of this identity to allow setting content record."
						/>
					)}
					{!isDeleting && (
						<InputField
							value={name ?? ""}
							InputProps={{
								readOnly: true,
								endAdornment: <EndAdornment isPrimary={ensName === name} />,
							}}
						/>
					)}
					<InputField
						label="Content Hash"
						placeholder={originalContentHash === undefined ? "fetching content hash..." : "eg. ipfs://bafedfd........"}
						focused
						disabled={!isEditing && doesContentExist}
						value={
							isEditing
								? draftContentHash
								: draftContentHash && doesContentExist
									? `${draftContentHash.slice(0, 10)}...${draftContentHash.slice(-3)}`
									: draftContentHash
						}
						onChange={(event) => {
							const { value } = event.target;
							setDraftContentHash(value as Address);
						}}
						InputProps={{
							endAdornment:
								doesContentExist && !isDeleting ? (
									<Flex>
										<ResolverButton
											sx={{ marginRight: 1 }}
											variant="contained"
											onClick={() => {
												setIsEditing((v) => !v);
											}}
										>
											<Edit />
										</ResolverButton>
										<Collapse
											style={{ height: "auto" }}
											orientation="horizontal"
											in={!isEditing}
										>
											<ResolverButton
												disabled={isEditing}
												variant="contained"
												onClick={() => {
													setIsDeleting(true);
												}}
											>
												<Close />
											</ResolverButton>
										</Collapse>
									</Flex>
								) : undefined,
						}}
					/>
					{!isDeleting && (
						<Note pt={4} pb={2}>
							Please note that this hash will be saved as one of the records for
							this registered name.
						</Note>
					)}
					<Collapse in={isProgressVisible}>
						<FlexCenter pt={2}>
							<Relative width="100%">
								<ProgressBar
									isError={isError}
									isPaused={!isTransactionLoading}
									isVisible={isProgressVisible}
									isSuccess={isSuccess}
								/>
								<ViewTransaction isVisible={isSuccess} hash={txHash} />
							</Relative>
						</FlexCenter>
					</Collapse>
				</FormContainer>
			</TransferContainer>
			<FlexRight width="100%">
				<ActionButton
					disabled={isPending || isTransactionLoading}
					sx={{ marginRight: 1 }}
					variant="text"
					onClick={() => {
						if (isDeleting) {
							return setIsDeleting(false);
						}
						router.replace("/", { scroll: false });
						closeModal();
					}}
				>
					{isSuccess ? "Close" : "Cancel"}
				</ActionButton>
				<Collapse orientation="horizontal" in={!isSuccess && isPrompt}>
					<ActionButton
						disabled={
							inGracePeriod || isPending || isSuccess || isTransactionLoading
						}
						variant="contained"
						onClick={() => {
							handleSetContent();
						}}
					>
						Confirm
					</ActionButton>
				</Collapse>
			</FlexRight>
		</Grid>
	);
};

export default SetContentRecord;
