import { NameResponse, useNamesQuery } from "@/redux/graphql/graphqlApi";
import {
  ClubRanking,
  SingleRanking,
  useLeaderboardState,
} from "@/redux/leaderboard/leaderboardSlice";
import { findCharacterSet, isASCII } from "@/utils/common";
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

  const [singleEmojis, setSingleEmojis] = useState<SingleRanking[]>([]);
  const [singleCharacters, setSingleCharacters] = useState<SingleRanking[]>([]);

  const [oneKClub, setOneKClub] = useState<ClubRanking[]>([]);
  const [tenKClub, setTenKClub] = useState<ClubRanking[]>([]);

  const { data } = useNamesQuery({ lastId: lastQueryId });
  const { updateTopRanking, updateRankings } = useLeaderboardState();

  const getTop50Ranking = () => {
    const groupedBy = domains.reduce(
      (entryMap, item) =>
        entryMap.set(item?.wrappedOwner?.id, [
          ...(entryMap.get(item?.wrappedOwner?.id) || []),
          item,
        ]),
      new Map()
    );

    const sorted = [...groupedBy.entries()]
      .sort((a, b) => {
        return b[1].length - a[1].length;
      })
      .map((item) => {
        return {
          owner: item[0],
          names: item[1],
          total: item[1].length,
        };
      })
      .slice(0, 50);

    updateTopRanking(sorted);
  };

  const getRankings = () => {
    domains?.forEach(({ wrappedOwner, labelName }, index) => {
      const itemData = {
        owner: wrappedOwner?.id,
        label: labelName,
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

    const sortedOneK = oneKClub.sort((a, b) => {
      return Number(a.label) - Number(b.label);
    });

    const sortedTenK = tenKClub.sort((a, b) => {
      return Number(a.label) - Number(b.label);
    });

    setSingleEmojis([...singleEmojis]);
    setSingleCharacters([...singleCharacters]);
    setOneKClub([...sortedOneK]);
    setTenKClub([...sortedTenK]);

    updateRankings({
      singleEmoji: singleEmojis,
      singleCharacter: singleCharacters,
      "999Club": oneKClub,
      "10KClub": tenKClub,
    });
  };

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

  useEffect(() => {
    if (isFetched) {
      // Get Top 50 Ranking here
      // console.log("domains:: ", domains);
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
