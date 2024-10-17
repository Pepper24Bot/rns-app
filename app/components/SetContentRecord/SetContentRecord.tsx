import { useEffect, useState } from "react";
import { Collapse, Grid, styled, alpha } from "@mui/material";
import {
	ActionButton,
	FlexCenter,
	FlexRight,
	ModalInputField as InputField,
	Relative,
	SecondaryLabel,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import type { TransactionProps } from "@/interfaces/global/transaction";
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

export const SetContentRecord: React.FC<TransactionProps> = (
	props: TransactionProps,
) => {
	const router = useRouter();

	const { address, item } = props;
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

	const [content, setContent] = useState<string>("");

	const [txHash, setTxHash] = useState<string>("");

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
		const { data, isSuccess } = await setContentRecord({ name, content });

		if (isSuccess) {
			setWatchContent(true);
			setTxHash(data.hash);
		} else {
			setIsError(true);
			setIsPending(false);
		}
	};

	useEffect(() => {
		if (isContentSet) {
			enqueueSnackbar(
				`You have successfully set ${name}'s content record to ${content}!`,
				{ variant: "success" },
			);

			// Refetch the ens name so that the toolbar will update the primary name
			setIsSuccess(true);
			setIsPending(false);
		}
	}, [content, isContentSet, enqueueSnackbar, name]);

	return (
		<Grid>
			<TransferContainer container>
				<EnsImage name={name ?? ""} />
				<FormContainer>
					{inGracePeriod && (
						<GracePeriodTip
							expiryDate={expiryDate}
							gracePeriod={gracePeriod}
							content="Extend the expiry of this identity to allow setting content record."
						/>
					)}
					<InputField
						value={name ?? ""}
						InputProps={{
							readOnly: true,
							endAdornment: <EndAdornment isPrimary={ensName === name} />,
						}}
					/>
					<InputField
						label="Content Hash"
						placeholder="eg. ipfs://bafedfd........"
						focused
						value={content}
						onChange={(event) => {
							const { value } = event.target;
							setContent(value);
						}}
					/>
					<Note pt={4} pb={2}>
						Please note that this hash will be saved as one of the records for
						this registered name.
					</Note>
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
						router.replace("/", { scroll: false });
						closeModal();
					}}
				>
					{isSuccess ? "Close" : "Cancel"}
				</ActionButton>
				<Collapse orientation="horizontal" in={!isSuccess}>
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
