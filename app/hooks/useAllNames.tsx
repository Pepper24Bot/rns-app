import { NameResponse, useNamesQuery } from "@/redux/graphql/graphqlApi";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

interface Props {
  /** Flag to know whether the hook will be called */
  skip?: boolean;
}

export default function useAllNames(props?: Props) {
  const [lastQueryId, setLastQueryId] = useState<string>("");
  const [lastId, setLastId] = useState<string>("");
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [domains, setDomains] = useState<NameResponse[]>([]);

  const { data } = useNamesQuery({ lastId: lastQueryId });

  useEffect(() => {
    if (!isEmpty(data?.domains)) {
      setIsFetching(true);
      const queryId = data?.domains[999]?.id || lastQueryId;
      const length = (data?.domains?.length || 0) - 1;
      const id = data?.domains[length]?.id || lastId;

      setLastQueryId(queryId);
      setLastId(id);

      if (isEmpty(data?.domains[999]?.id)) {
        setIsFetched(true);
        setIsFetching(false);
      }
    }
  }, [data?.domains[999]]);

  useEffect(() => {
    if (lastQueryId && !isEmpty(data?.domains)) {
      const domainList = data?.domains as NameResponse[];
      domains.push(...domainList);
      setDomains([...domains]);
    }
  }, [lastId]);

  return {
    domains,
    isFetching,
    isFetched,
  };
}
