import { NavLink, useLocation } from "react-router-dom";
import { Home, Target, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function ChildNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="flex h-16 items-center px-4 border-b bg-white dark:bg-gray-950 w-full">
      <div className="flex items-center justify-between w-full">
        <Logo variant="child" />

        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/child/dashboard">
            <Button
              variant={pathname === "/child/dashboard" ? "secondary" : "ghost"}
              size="sm"
              className="flex gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </NavLink>
          <NavLink to="/child/goals">
            <Button
              variant={pathname === "/child/goals" ? "secondary" : "ghost"}
              size="sm"
              className="flex gap-2"
            >
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </Button>
          </NavLink>
          <NavLink to="/child/expenses">
            <Button
              variant={pathname === "/child/expenses" ? "secondary" : "ghost"}
              size="sm"
              className="flex gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Expenses</span>
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
