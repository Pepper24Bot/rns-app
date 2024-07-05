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

interface PushProps {
  labelName: string;
  length: number;
  item: Ranking;
  ranks: Ranking[];
}

export default function useAllNames(props?: Props) {
  const [lastQueryId, setLastQueryId] = useState<string>("");
  const [lastId, setLastId] = useState<string>("");

  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [domains, setDomains] = useState<NameResponse[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);

  const { updateRankings, useLeaderboard } = useLeaderboardState();
  const { isFetched: isSuccess } = useLeaderboard();
  const { data } = useNamesQuery({ lastId: lastQueryId });

  const pushToEmojis = (props: PushProps) => {
    const { labelName, length, ranks, item } = props;

    if (findCharacterSet(labelName) === "emoji" && length <= 2) {
      ranks.push(item);
    }
  };

  const pushToCharacters = (props: PushProps) => {
    const { labelName, length, ranks, item } = props;

    if (
      (findCharacterSet(labelName) === "letter" ||
        findCharacterSet(labelName) === "digit") &&
      length === 1
    ) {
      ranks.push(item);
    }
  };

  const pushToOneKClub = (props: PushProps) => {
    const { labelName, length, ranks, item } = props;

    if (
      findCharacterSet(labelName) === "digit" &&
      length <= 3 &&
      Number(labelName) < 1000
    ) {
      ranks.push(item);
    }
  };

  const pushToTenKClub = (props: PushProps) => {
    const { labelName, length, ranks, item } = props;

    if (
      findCharacterSet(labelName) === "digit" &&
      length <= 4 &&
      Number(labelName) < 10000 &&
      Number(labelName) > 999
    ) {
      ranks.push(item);
    }
  };

  const groupNameByAddres = (items: Ranking[]) => {
    const groupedByOwner = items.reduce(
      (entryMap, item) =>
        entryMap.set(item.owner, [...(entryMap.get(item.owner) || []), item]),
      new Map()
    );

    return groupedByOwner;
  };

  const primaryMapper = (items: Ranking[], ranksWithPrimary: Ranking[]) => {
    return items.map((item) => {
      const data = [...rankings, ...ranksWithPrimary].find((name) => {
        return name.owner === item.owner;
      });

      return {
        ...data,
        ...item,
      };
    });
  };

  // only fetch names that are not yet fetched by TopRanking50
  const getPrimaryNamesOfAllranks = async (items: Ranking[]) => {
    const filteredNames: Ranking[] = [];

    /**
     * group names by address to avoid calling getEnsName multiple times on the same address.
     * and filter the address, address that exists already in rankings list, should
     * not be included in the new list, to lessen api calls
     */
    groupNameByAddres(items).forEach((name, index) => {
      const isExist = rankings?.find((rank) => {
        return rank.owner === name[0].owner;
      });

      if (isEmpty(isExist)) {
        filteredNames.push(name[0]);
      }
    });

    // get primary names
    const primaryNames = await Promise.all(
      filteredNames?.map(async (name, index) => {
        const response = await getEnsName(config, {
          address: name.owner as Address,
        });

        return {
          ...name,
          primary: response as string,
        };
      })
    );

    return primaryNames;
  };

  const appendPrimaryInCharacters = (
    items: Ranking[],
    ranksWithPrimary: Ranking[]
  ) => {
    const sortedItems = items.sort((a, b) => {
      return (
        a.label?.localeCompare(b.label || "", "en", { numeric: true }) || 0
      );
    });

    return primaryMapper(sortedItems, ranksWithPrimary);
  };

  const appendPrimaryInClubRank = (
    items: Ranking[],
    ranksWithPrimary: Ranking[]
  ) => {
    const sortedItems = items.sort((a, b) => {
      return a.label?.length === b.label?.length
        ? Number(a.label) - Number(b.label)
        : Number(a.label) - Number(b.label) &&
            (a.label?.length || 0) - (b.label?.length || 0);
    });

    return primaryMapper(sortedItems, ranksWithPrimary);
  };

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

    const sorted = [...groupedBy.entries()]
      .sort((a, b) => {
        return b[1].length - a[1].length;
      })
      .slice(0, maxLength);

    const mappedNames = await Promise.all(
      sorted.map(async (item) => {
        let primary = null;

        if (item[0]) {
          primary = await getEnsName(config, {
            address: item[0] as Address,
          });
        }

        return {
          owner: item[0],
          names: item[1],
          total: item[1].length,
          primary: primary as string,
        };
      })
    );

    setRankings([...mappedNames]);
    updateRankings({
      top: {
        isFetched: true,
        ranking: [...mappedNames],
      },
      totalCountNames: domains?.length,
    });
  };

  const getRankings = async () => {
    const singleEmojis: Ranking[] = [];
    const singleCharacters: Ranking[] = [];
    const oneKClub: Ranking[] = [];
    const tenKClub: Ranking[] = [];

    // loop through each of the item and push to leaderboard categories
    domains?.forEach(({ wrappedOwner, labelName, expiryDate }, index) => {
      const item = {
        owner: wrappedOwner?.id,
        label: labelName,
        expiryDate: getExpiry(expiryDate).distance,
      };

      const props = {
        labelName,
        length: labelName.length,
        item,
      };

      pushToEmojis({ ...props, ranks: singleEmojis });
      pushToCharacters({ ...props, ranks: singleCharacters });
      pushToOneKClub({ ...props, ranks: oneKClub });
      pushToTenKClub({ ...props, ranks: tenKClub });
    });

    // get the primary names of the addresses in the ranking
    const rankingsWithPrimary = await getPrimaryNamesOfAllranks([
      ...singleEmojis,
      ...singleCharacters,
      ...oneKClub,
      ...tenKClub,
    ]);

    // loop through the items again and include the primary name
    const emojisRank = primaryMapper(singleEmojis, rankingsWithPrimary);
    const charactersRank = appendPrimaryInCharacters(
      singleCharacters,
      rankingsWithPrimary
    );

    const sortedOneK = appendPrimaryInClubRank(oneKClub, rankingsWithPrimary);
    const sortedTenK = appendPrimaryInClubRank(tenKClub, rankingsWithPrimary);

    updateRankings({
      singleEmoji: {
        isFetched: true,
        ranking: [...emojisRank],
      },
      singleCharacter: {
        isFetched: true,
        ranking: [...charactersRank],
      },
      oneKClub: {
        isFetched: true,
        ranking: [...sortedOneK],
      },
      tenKClub: {
        isFetched: true,
        ranking: [...sortedTenK],
      },
      isFetched: true,
    });
  };

  useEffect(() => {
    if (!isEmpty(data?.domains) && !isSuccess) {
      setIsFetching(true);
      const queryId = data?.domains[999]?.id || lastQueryId;
      const id = data?.domains[length]?.id || lastId;

      setLastId(id);
      if (isEmpty(data?.domains[999]?.id)) {
        setIsFetched(true);
        setIsFetching(false);
      } else {
        setLastQueryId(queryId);
      }
    }
  }, [data?.domains, isSuccess]);

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
    }
  }, [isFetched]);

  useEffect(() => {
    if (!isEmpty(rankings)) {
      getRankings();
    }
  }, [rankings?.length]);

  return {
    domains,
    isFetching,
    isFetched,
  };
}
