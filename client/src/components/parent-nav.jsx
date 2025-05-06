import { NavLink, useLocation } from "react-router-dom";
import { Home, CreditCard, Settings, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function ParentNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="flex h-16 items-center px-4 border-b bg-white dark:bg-gray-950 w-full">
      <div className="flex items-center justify-between w-full">
        <Logo />

        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/parent/dashboard">
            <Button
              variant={pathname === "/parent/dashboard" ? "default" : "ghost"}
              size="sm"
              className="flex gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </NavLink>
          <NavLink to="/parent/transactions">
            <Button
              variant={pathname === "/parent/transactions" ? "default" : "ghost"}
              size="sm"
              className="flex gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Transactions</span>
            </Button>
          </NavLink>
          <NavLink to="/parent/children">
            <Button
              variant={pathname === "/parent/children" ? "default" : "ghost"}
              size="sm"
              className="flex gap-2"
            >
              <Users className="h-4 w-4" />
              <span>Children</span>
            </Button>
          </NavLink>
          <NavLink to="/parent/settings">
            <Button
              variant={pathname === "/parent/settings" ? "default" : "ghost"}
              size="sm"
              className="flex gap-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </NavLink>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
