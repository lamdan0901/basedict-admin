"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import { ACCESS_TOKEN } from "@/constants";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (getCookie(ACCESS_TOKEN)) {
      setIsLogin(true);
    }
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-gray-200">
      <div className="flex items-center">
        <div className="font-bold">Base Dict Admin</div>
      </div>
      <div className="font-bold">
        You are {isLogin ? " logged in" : " not logged in"}
      </div>
    </header>
  );
};

export default Header;
