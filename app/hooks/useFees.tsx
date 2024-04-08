import { formatUnits } from "ethers/lib/utils.js";
import { Payment } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";

export interface FeesProps {
  rent?: bigint;
  gasFee?: bigint;
  gasPrice?: bigint;
  gasUsed?: bigint;
  enabled?: boolean;
  raw?: boolean;
  payment?: Payment;
}

export interface FeesResponse {
  rentFee: number;
  transactionFee: number;
  totalFee: number;
}

export interface Options {
  raw?: boolean;
}

export default function useFees(props: FeesProps) {
  const { rent = 0, gasFee = 0, payment = PAYMENT_METHOD[0] } = props;

  const getRentFee = () => {
    return rent ? Number(formatUnits(rent, payment.decimals)) : 0;
  };

  const getTransactionFee = () => {
    // https://explorer.rootnet.live/token/0xCCCCcCCc00000002000000000000000000000000
    return gasFee ? Number(formatUnits(gasFee, 6)) : 0;
  };

  // TODO: Convert to USDC and ROOT
  const getTotalFee = () => {
    const rent = getRentFee();
    const transaction = getTransactionFee();

    const totalFee =
      rent && transaction ? Number(rent) + Number(transaction) : 0;

    return totalFee ? Number(totalFee.toFixed(6)) : 0;
  };

  return {
    rentFee: getRentFee(),
    transactionFee: getTransactionFee(),
    totalFee: getTotalFee(),
  };
}
