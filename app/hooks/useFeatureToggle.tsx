const REGISTRATION = process.env.NEXT_PUBLIC_REGISTRATION === "false" ? 0 : 1;
const EXPIRY = process.env.NEXT_PUBLIC_EXPIRY === "false" ? 0 : 1;
const PRIMARY = process.env.NEXT_PUBLIC_PRIMARY === "false" ? 0 : 1;
const LINK = process.env.NEXT_PUBLIC_LINK === "false" ? 0 : 1;
const TRANSFER = process.env.NEXT_PUBLIC_TRANSFER === "false" ? 0 : 1;

export enum FeatureList {
  Identities = "true",
  FAQ = "true",
  Favorites = "false",
  Notifications = "false",
  LoyaltyPoints = "false",
  Subscription = "true",
  ViewOptions = "false",
  SocialAccounts = "false",
  ShareStatus = "false",
  ShareRegistration = "false",
  Registration = REGISTRATION,
  Expiry = EXPIRY,
  Primary = PRIMARY,
  Link = LINK,
  Transfer = TRANSFER,
}

/**
 * Utilize this custom hook to
 * identify if a feature is enabled/disabled.
 */
export default function useFeatureToggle() {
  const isFeatureEnabled = (feature?: string | number, name?: string) => {
    if (feature === "true" || feature === "false") {
      return feature === "true" || feature === undefined ? true : false;
    } else {
      return (
        FeatureList[feature as keyof typeof FeatureList] === "true" ||
        FeatureList[feature as keyof typeof FeatureList] === 1
      );
    }
  };

  return { isFeatureEnabled, FeatureList };
}
