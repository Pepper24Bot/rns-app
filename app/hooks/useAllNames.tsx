import { config } from "@/chains/config";
import { NameResponse, useNamesQuery } from "@/redux/graphql/graphqlApi";
import {
  Ranking,
  useLeaderboardState,
} from "@/redux/leaderboard/leaderboardSlice";
import { findCharacterSet, getExpiry } from "@/utils/common";
import { getEnsName } from "@wagmi/core";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { Address } from "viem";

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

  const { data } = useNamesQuery({ lastId: lastQueryId }, { skip: isFetched });
  const { updateTopRanking, updateRankings, useLeaderboard } =
    useLeaderboardState();

  const { isFetched: isSuccess } = useLeaderboard();

  const getTop50Ranking = async () => {
    const groupedBy = domains.reduce(
      (entryMap, item) =>
        entryMap.set(item?.wrappedOwner?.id, [
          ...(entryMap.get(item?.wrappedOwner?.id) || []),
          item,
        ]),
      new Map()
    );

    const maxLength = groupedBy.size > 50 ? 50 : groupedBy.size;

    const sorted = await Promise.all(
      [...groupedBy.entries()]
        .sort((a, b) => {
          return b[1].length - a[1].length;
        })
        .slice(0, maxLength)
        .map(async (item, index) => {
          const response = await getEnsName(config, {
            address: item[0] as Address,
          });

          return {
            owner: item[0],
            names: item[1],
            total: item[1].length,
            primary: response as string,
          };
        })
    );

    updateTopRanking({
      isFetched: true,
      ranking: [...sorted],
    });
  };

  const getRankings = () => {
    const singleEmojis: Ranking[] = [];
    const singleCharacters: Ranking[] = [];
    const oneKClub: Ranking[] = [];
    const tenKClub: Ranking[] = [];

    domains?.forEach(({ wrappedOwner, labelName, expiryDate }, index) => {
      const itemData = {
        owner: wrappedOwner?.id,
        label: labelName,
        expiryDate: getExpiry(expiryDate).distance,
      };

      const length = labelName.length;

      if (findCharacterSet(labelName) === "emoji" && length <= 2) {
        singleEmojis.push(itemData);
      } else if (
        (findCharacterSet(labelName) === "letter" ||
          findCharacterSet(labelName) === "digit") &&
        length === 1
      ) {
        singleCharacters.push(itemData);
      }

      if (
        findCharacterSet(labelName) === "digit" &&
        length <= 3 &&
        Number(labelName) < 1000 &&
        String(parseInt(labelName)).length === length
      ) {
        oneKClub.push(itemData);
      } else if (
        findCharacterSet(labelName) === "digit" &&
        length <= 4 &&
        Number(labelName) < 10000 &&
        Number(labelName) > 999
      ) {
        tenKClub.push(itemData);
      }
    });

    const sortedCharacter = singleCharacters.sort((a, b) => {
      return (
        a.label?.localeCompare(b.label || "", "en", { numeric: true }) || 0
      );
    });

    const sortedOneK = oneKClub.sort((a, b) => {
      return Number(a.label) - Number(b.label);
    });

    const sortedTenK = tenKClub.sort((a, b) => {
      return Number(a.label) - Number(b.label);
    });

    updateRankings({
      singleEmoji: {
        isFetched: true,
        ranking: [...singleEmojis],
      },
      singleCharacter: {
        isFetched: true,
        ranking: [...sortedCharacter],
      },
      oneKClub: {
        isFetched: true,
        ranking: [...sortedOneK],
      },
      tenKClub: {
        isFetched: true,
        ranking: [...sortedTenK],
      },
      totalCountNames: domains?.length,
    });
  };

  useEffect(() => {
    if (!isEmpty(data?.domains) && !isSuccess) {
      setIsFetching(true);
      const queryId = data?.domains[999]?.id || lastQueryId;
      const length = (data?.domains?.length || 0) - 1;
      const id = data?.domains[length]?.id || lastId;

      setLastId(id);
      if (isEmpty(data?.domains[999]?.id)) {
        setIsFetched(true);
        setIsFetching(false);
      } else {
        setLastQueryId(queryId);
      }
    }
  }, [data?.domains]);

  useEffect(() => {
    if (lastId && !isEmpty(data?.domains) && !isSuccess) {
      const domainList = data?.domains as NameResponse[];
      domains.push(...domainList);
      setDomains([...domains]);
    }
  }, [lastId]);

  useEffect(() => {
    if (isFetched) {
      getTop50Ranking();
      getRankings();
    }
  }, [isFetched]);

  return {
    domains,
    isFetching,
    isFetched,
  };
}
