import { ContractDetails } from "@/hooks/useContractDetails";

export interface ProxyProps {
    registrarController?: ContractDetails;
    publicResolver?: ContractDetails;
    reverseRegistrar?: ContractDetails
}