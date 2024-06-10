import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "./components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { ChevronDown } from "lucide-react";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-screen gap-2">
      <div className="flex justify-between p-4 border-b">
        <h1 className="text-lg md:text-2xl">Farhan Math Tools</h1>
        <div className="flex flex-row items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"link"}>
                Menu <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/">Tables</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/sums">Sums</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
      <div className="h-full w-full p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
