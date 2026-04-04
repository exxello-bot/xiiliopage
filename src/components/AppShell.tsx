import { Outlet } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";
import AuthGuard from "./AuthGuard";

const AppShell = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pt-[env(safe-area-inset-top)] pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Outlet />
        <BottomTabBar />
      </div>
    </AuthGuard>
  );
};

export default AppShell;
