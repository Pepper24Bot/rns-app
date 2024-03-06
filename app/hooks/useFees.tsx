import { formatUnits } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { formatEther } from "viem";

export interface FeesProps {
  rent?: bigint;
  gasFee?: bigint;
  gasPrice?: bigint;
  gasUsed?: bigint;
  enabled?: boolean;
}

export interface FeesResponse {
  rentFee: string | bigint;
  transactionFee: string | bigint;
  totalFee: number;
}

export default function useFees(props: FeesProps) {
  const { rent, gasFee, gasPrice = BigInt(0), enabled } = props;

  // TODO: Research about Pricing Oracle
  /**
   * TODO: The rent is priced in USDC,
   * so we need to convert it to ROOT if the user chose to pay in ROOT
   * @returns
   */
  const getRentFee = () => {
    return rent ? formatEther(rent) : BigInt(0);
  };

  /**
   * TODO: The gas fee is in XRP,
   * convert it to ROOT or USDC
   * @returns
   */
  const getTransactionFee = () => {
    const transactionFee = gasFee
      ? BigNumber.from(gasFee).mul(gasPrice)
      : BigNumber.from(0);

    return formatEther(transactionFee.toBigInt());
  };

  // TODO: Convert to USDC and ROOT
  const getTotalFee = () => {
    const rent = getRentFee();
    const transaction = getTransactionFee();

    return rent && transaction ? Number(rent) + Number(transaction) : 0;
  };

  return {
    rentFee: getRentFee(),
    transactionFee: getTransactionFee(),
    totalFee: getTotalFee(),
  };
}
