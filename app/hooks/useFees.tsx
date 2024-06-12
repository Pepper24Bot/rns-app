import { PAYMENT_METHOD } from "@/constants/components";
import { Payment } from "@/redux/form/formSlice";
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

export default function useFees(props: FeesProps) {
  const { rent = 0, gasFee = 0, payment = PAYMENT_METHOD[0] } = props;

  const getRentFee = () => {
    return rent ? Number(formatUnits(rent, payment.decimals)) : 0;
  };

  const getTransactionFee = () => {
    return gasFee ? Number(formatUnits(gasFee, 6)) : 0;
  };

  return {
    rentFee: getRentFee(),
    transactionFee: getTransactionFee(),
    totalFee: getRentFee(),
  };
}
