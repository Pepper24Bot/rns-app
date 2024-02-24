/**
 * Utilize this custom hook to
 * identify if a feature is enabled/disabled.
 */

export enum FeatureList {
  Subscription = "true",
  Favorites = "false",
}

export default function useFeatureToggle() {
  const isFeatureEnabled = (feature: string) => {
    return feature === "true" || feature === undefined ? true : false;
  };

  return { isFeatureEnabled, FeatureList };
}
