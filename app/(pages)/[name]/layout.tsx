import { Suspense } from "react";
import MainPage from "@/components/Main/MainPage";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<></>}>
      {/* <MainPage /> */}
      {children}
    </Suspense>
  );
}
