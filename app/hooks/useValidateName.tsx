import { useModalState } from "@/redux/modal/modalSlice";
import { isNameSupported } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { normalize } from "viem/ens";
import useErrorMessage from "./useErrorMessage";

export interface NameProps {
  name?: string;
  label?: string;
}

export default function useValidateName(props: NameProps) {
  const { label = "" } = props;

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { closeModal } = useModalState();
  const { getErrorDisplay } = useErrorMessage();

  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [normalizedLabel, setNormalizedLabel] = useState<string>("");

  const validateName = () => {
    const supported = isNameSupported(label);

    if (supported) {
      try {
        const normalized = normalize(label);
        setNormalizedLabel(normalized);
      } catch (error) {
        router.replace("/", { scroll: false });
        const reason = `Unable to normalize ${label}.root. Redirecting to main page.`;
        const value = (error as any).message || "";
        enqueueSnackbar(getErrorDisplay(reason, value), { variant: "info" });
        closeModal();
      }
    } else {
      router.replace("/", { scroll: false });
      enqueueSnackbar(
        `${label}.root is not supported. Redirecting to main page.`,
        {
          variant: "info",
        }
      );
      closeModal();
    }
  };

  useEffect(() => {
    if (hasMounted && label) {
      validateName();
    }
  }, [label, hasMounted]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return { label: normalizedLabel };
}
