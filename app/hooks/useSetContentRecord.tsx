import { useWriteContract } from "wagmi";
import { useState } from "react";
import type { ErrorResponse } from "@/services/interfaces";
import { type Address, namehash, toHex } from "viem";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { initializeResponse } from "@/utils/common";
import { useSnackbar } from "notistack";

import useContractDetails from "./useContractDetails";
import useProxySetContent from "./FuturePass/useProxySetContent";
import useWaitTransaction from "./useWaitTransaction";
import useErrorMessage from "./useErrorMessage";

/** TODO: Optimize this hook */
export default function useSetContentRecord() {
	const publicResolver = useContractDetails({ action: "PublicResolver" });

	const { enqueueSnackbar } = useSnackbar();
	const { useRootNetwork } = useRootNetworkState();
	const { getErrorMessage } = useErrorMessage();

	const {
		data: { address, isFpActive },
	} = useRootNetwork();

	const { waitForWriteTransaction } = useWaitTransaction();
	const { writeContractAsync } = useWriteContract();
	const { contentProxyCall } = useProxySetContent({
		publicResolver: publicResolver,
	});

	const [isContentLoading, setContentLoading] = useState(false);

	const handleSetContent = async (props: { name: string; content: string }) => {
		const { name, content } = props;
		let response = { ...initializeResponse() };

		if (name && content) {
			try {
				const nameHash = namehash(name);

				let transferHash = "0x" as Address;

				if (isFpActive) {
					transferHash = (await contentProxyCall({
						contentHash: content,
						name,
					})) as Address;
				} else {
					transferHash = await writeContractAsync({
						abi: publicResolver.abi,
						address: publicResolver.address,
						functionName: "setContenthash",
						account: address as Address,
						args: [nameHash, toHex(content)],
					});
				}

				enqueueSnackbar(`Setting content hash for ${name} is in progress.`, {
					variant: "info",
				});
				setContentLoading(true);
				response = await waitForWriteTransaction(transferHash);
			} catch (e) {
				const error = e as ErrorResponse;
				response.error = error;
				const message = getErrorMessage(error);
				enqueueSnackbar(message, { variant: "error" });
			}
		}
		setContentLoading(false);
		console.log("Content-Response:: ", response);
		return response;
	};

	return {
		setContentRecord: handleSetContent,
		isLoading: isContentLoading,
	};
}
