/**
 * Feature Toggle allows us to hide/display elements/features
 * without modifying the code. Utilize this component
 * when introducing new features to be able to commit and merge
 * code changes that are not ready to be shipped in production.
 */

import React from "react";
import useFeatureToggle, { FeatureList } from "@/hooks/useFeatureToggle";

export interface FeatureToggle {
  feature: FeatureList;
  children?: React.ReactNode;
}

export const FeatureToggle: React.FC<FeatureToggle> = (
  props: FeatureToggle
) => {
  const { feature, children } = props;
  const { isFeatureEnabled } = useFeatureToggle();

  return isFeatureEnabled(feature) ? (
    <>{children}</>
  ) : (
    <>{/** Do not render anything */}</>
  );
};

export default FeatureToggle;
