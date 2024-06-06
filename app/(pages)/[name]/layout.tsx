import { Suspense } from "react";
import MainPage from "@/components/Main/MainPage";

export default function DetailsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<></>}>
      <MainPage />
      {children}
    </Suspense>
  );
}
