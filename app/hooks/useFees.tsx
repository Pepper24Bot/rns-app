import { Payment } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";
import { formatUnits } from "viem";

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
    return gasFee ? Number(formatUnits(gasFee, 6)) : 0;
  };

  const getTotalFee = () => {
    const rent = getRentFee();
    const transaction = getTransactionFee();

    const totalFee =
      rent && transaction ? Number(rent) + Number(transaction) : 0;

    return totalFee || 0;
  };

  return {
    rentFee: getRentFee(),
    transactionFee: getTransactionFee(),
    totalFee: getRentFee(),
  };
}
