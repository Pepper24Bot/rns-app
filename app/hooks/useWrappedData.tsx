import { useEffect, useState } from "react";
import {
  GetWrapperDataParameters,
  GetWrapperDataReturnType,
  getWrapperData,
} from "@ensdomains/ensjs/public";
import useNetworkConfig from "./useNetworkConfig";

export interface WrappedProps extends GetWrapperDataParameters {
  skip?: boolean;
}

export default function useWrappedData(props: WrappedProps) {
  const { name, skip = false } = props;
  const { client } = useNetworkConfig();

  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wrappedName, setWrappedName] = useState<GetWrapperDataReturnType>();

  const getNameOwner = async () => {
    try {
      const data = await getWrapperData(client, {
        name,
      });

      setWrappedName(data);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      // TODO: Add error snackbar
    }
  };

  useEffect(() => {
    if (name && !skip) {
      getNameOwner();
    }
  }, [name, skip]);

  return {
    name: wrappedName,
    isLoading,
    isError,
    isSuccess,
  };
}
