/**
 * Utilize this custom hook to
 * identify if a feature is enabled/disabled.
 */

export enum FeatureList {
  Names = "true",
  Favorites = "false",
  Notifications = "false",
  LoyaltyPoints = "false",
  Subscription = "true",
  ViewOptions = "false",
  SocialAccounts = "false",
  ShareStatus = "false",
}

export default function useFeatureToggle() {
  const isFeatureEnabled = (feature: string) => {
    if (feature === "true" || feature === "false") {
      return feature === "true" || feature === undefined ? true : false;
    } else {
      return FeatureList[feature as keyof typeof FeatureList] === "true";
    }
  };

  return { isFeatureEnabled, FeatureList };
}
