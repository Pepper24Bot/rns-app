import { isNameSupported } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { normalize } from "viem/ens";

export interface NameProps {
  name?: string;
  label?: string;
}

export default function useValidateName(props: NameProps) {
  const { label = "" } = props;

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

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
        enqueueSnackbar(
          `Unable to normalize ${label}.root. Redirecting to main page.`,
          { variant: "info" }
        );
      }
    } else {
      router.replace("/", { scroll: false });
      enqueueSnackbar(
        `${label}.root is not supported. Redirecting to main page.`,
        {
          variant: "info",
        }
      );
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
