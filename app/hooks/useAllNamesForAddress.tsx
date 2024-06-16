import { useEffect, useState } from "react";
import {
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
  getNamesForAddress,
} from "@ensdomains/ensjs/subgraph";
import { isEmpty } from "lodash";
import { useEnsName } from "wagmi";

import useNetworkConfig from "./useNetworkConfig";

export interface NamesProps extends GetNamesForAddressParameters {
  skip?: boolean;
  page?: number;
  isTesting?: boolean;
}

export default function useAllNamesForAddress(props: NamesProps) {
  const { skip = false, address, page = 1, isTesting, ...rest } = props;
  const { filter, orderBy, orderDirection, pageSize = 50 } = rest;

  const { data: ensName } = useEnsName({ address });
  const { client } = useNetworkConfig();

  const [isError, setIsError] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(!skip);
  const [isFetched, setIsFetched] = useState<boolean>(true);

  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);
  const [rawNameList, setRawNameList] = useState<GetNamesForAddressReturnType>(
    []
  );
  const [pageCount, setPageCount] = useState(1);

  // Sub pages
  const [pages, setPages] = useState<GetNamesForAddressReturnType[]>([]);

  const movePrimaryNameToTop = (data: GetNamesForAddressReturnType) => {
    // Get the primary name
    const primaryName = data?.find((item) => {
      return item.name === ensName;
    });

    if (primaryName && !isEmpty(primaryName)) {
      const shifted = data?.filter((item) => {
        return item.name !== ensName;
      });

      shifted.unshift(primaryName);
      setRawNameList(shifted);
    } else {
      setRawNameList(data);
    }
  };

  const getSubPages = (
    data: GetNamesForAddressReturnType,
    pageCount: number
  ) => {
    const subPages = Array.from({ length: pageCount }).map((_, index) => {
      return data.slice(index * pageSize, index * pageSize + pageSize);
    });

    if (!isEmpty(subPages)) {
      setPages(subPages);
      if (!isEmpty(subPages[page - 1])) {
        setNames([...subPages[page - 1]]);
      }
    } else {
      names.length = 0;
      setNames([]);
    }
  };

  /**
   * TODO: Fix this
   * check how to get the total count of items in graphql
   * without the limit of 1000
   *
   * inifinitequery
   */
  const getAllNames = async () => {
    try {
      const data = await getNamesForAddress(client, {
        address,
        pageSize: 1000,
        filter,
        orderBy,
        orderDirection,
      });
      const totalCount = data.length;
      const count = Math.ceil(totalCount / pageSize);

      setPageCount(count);
      movePrimaryNameToTop(data);

      setIsFetched(true);
      setIsFetching(false);
    } catch (error) {
      setIsFetched(false);
      setIsFetching(false);

      console.log("error:: ", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (address && address !== "0x" && !skip) {
      setIsFetching(true);
    }
  }, [skip, address]);

  useEffect(() => {
    if (isFetched) {
      getSubPages(rawNameList, pageCount);
    }
  }, [page, pageCount, rawNameList, isFetched]);

  useEffect(() => {
    if (address && address !== "0x" && !skip) {
      getAllNames();
    }
  }, [
    skip,
    address,
    filter?.searchString,
    filter?.allowExpired,
    orderBy,
    orderDirection,
    pageSize,
    ensName,
    // page,
  ]);

  return {
    /**
     * This will return names
     * based on the provided pageSize, filters and sorting options
     *
     * e.g pagesize = 3
     * this will only contain 3 names
     */
    names,

    /**
     * This will return all names divided by
     * the page size.
     *
     * e.g
     * total names = 30
     * pagesize = 3
     *
     * returns array size of 10, and each item in the array
     * will contain 3 names
     */
    pages,
    totalNames: rawNameList.length,
    pageCount,

    isFetching,
    isFetched,
    isError,
  };
}
