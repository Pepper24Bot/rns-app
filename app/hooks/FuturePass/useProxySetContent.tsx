import "@therootnetwork/api-types"; // optional, for Typescript support
import { toHex, type Address } from "viem";
import { Contract } from "ethers";
import type { ProxyProps } from "@/interfaces/proxy";
import type { TransferProps } from "@/interfaces/transfer";
import useSendProxyCall from "./useSendProxyCall";

export default function useProxySetContent(props: ProxyProps) {
	const { publicResolver } = props;
	const { sendProxyCallNoGas } = useSendProxyCall();

	const getContract = () => {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return new Contract(publicResolver!.address, publicResolver!.abi);
	};

	const contentProxyCall = async (props: {
		contentHash: string;
		name: string;
	}) => {
		const { contentHash, name } = props;

		if (contentHash && name) {
			const publicResolver = getContract();
			const transferData = publicResolver.interface.encodeFunctionData(
				"setContenthash",
				[name, contentHash],
			);

			try {
				const transaction = await sendProxyCallNoGas({
					evmContract: {
						address: publicResolver.address as Address,
						data: transferData as Address,
					},
				});

				console.log("Transfer-Transaction:: ", transaction);
				return transaction;
			} catch (error) {
				console.log("Transfer-Error:: ", error);
				throw new Error((error as { message: string }).message);
			}
		}
	};

	return {
		contentProxyCall,
	};
}
