import { config } from "@/chains/config";
import { NameResponse, useNamesQuery } from "@/redux/graphql/graphqlApi";
import {
  Ranking,
  useLeaderboardState,
} from "@/redux/leaderboard/leaderboardSlice";
import {
  getExpiry,
  isInGracePeriod,
  pushToCharacters,
  pushToEmojis,
  pushToOneKClub,
  pushToTenKClub,
  sortByClubRank,
  sortByLabel,
} from "@/utils/common";
import { getEnsName } from "@wagmi/core";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { Address } from "viem";

interface Props {
  /** Flag to know whether the hook will be called */
  skip?: boolean;
}

export interface PushProps {
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
  const { data } = useNamesQuery(
    { lastId: lastQueryId },
    { skip: props?.skip }
  );

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
    const sortedItems = sortByLabel(items);
    return primaryMapper(sortedItems, ranksWithPrimary);
  };

  const appendPrimaryInClubRank = (
    items: Ranking[],
    ranksWithPrimary: Ranking[]
  ) => {
    const sortedItems = sortByClubRank(items);
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

    const sorted = [...groupedBy.entries()].sort((a, b) => {
      return b[1].length - a[1].length;
    });
    // .slice(0, maxLength);

    const allNames = await Promise.all(
      sorted.map(async (item, index) => {
        let primary = null;

        if (item[0] && index < maxLength) {
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

    const topFifty = [...allNames].slice(0, maxLength);

    setRankings([...topFifty]);
    updateRankings({
      top: {
        isFetched: true,
        ranking: [...topFifty],
      },
      totalNames: [...allNames],
      totalCountNames: domains?.length,
    });
  };

  const getRankings = async () => {
    const singleEmojis: Ranking[] = [];
    const singleCharacters: Ranking[] = [];
    const oneKClub: Ranking[] = [];
    const tenKClub: Ranking[] = [];

    // loop through each of the item and push to leaderboard categories
    domains?.forEach(
      ({ wrappedOwner, labelName, expiryDate, registration }, index) => {
        const inGracePeriod = isInGracePeriod(expiryDate);
        const { distanceToExpiry, remainingGrace } = getExpiry(
          registration?.expiryDate,
          expiryDate
        );

        const expiryValue = !inGracePeriod
          ? `Expires in ${distanceToExpiry}`
          : `Grace period ends in ${remainingGrace.label}`;

        const item = {
          owner: wrappedOwner?.id,
          label: labelName,
          expiryDate: expiryValue,
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
      }
    );

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
