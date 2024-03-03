import { formatUnits } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";

export interface FeesProps {
  rent?: BigNumber;
  transaction?: BigNumber;

  enabled?: boolean;
}

export default function useFees(props: FeesProps) {
  const { rent, transaction, enabled } = props;

  // TODO: Convert to USDC and ROOT (XRP)
  const getRentFee = () => {
    return rent ? formatUnits(rent, 18) : 0;
  };

  // TODO: Convert to USDC and ROOT (XRP)
  const getTransactionFee = () => {
    return transaction ? formatUnits(transaction, 18) : 0;
  };

  // TODO: Convert to USDC and ROOT (XRP)
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
