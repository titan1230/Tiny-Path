import React, { Suspense } from "react";
import LandingPageMain from "@/components/Landing/LandingPageMain";
import { SessionProvider } from "next-auth/react";

interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  username?: string;
}

const LandingPage: React.FC = async () => {

  return (
    <Suspense
      fallback={<div className="flex justify-center items-center h-screen"></div>}
    >
      <SessionProvider>
        <LandingPageMain />
      </SessionProvider>
    </Suspense>
  )
};

export default LandingPage;