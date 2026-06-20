import React from "react";
import { Input } from "./ui/input";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Bell, Search, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

const NavBar = () => {
  return (
    <header className="h-15 border-b border-slate-300 bg-white py-10 px-6">
      <div className="flex h-full items-center justify-between">
        {/* Search */}
        <div className="relative w-full max-w-lg border-slate-100">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tracked emails.."
            className="pl-10 py-5 h-9 w-full rounded-lg placeholder:text-slate-600 border-slate-200 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-100"
          />
        </div>

        {/* Right Side */}
        <div className=" flex items-center gap-1.5">
          <Button
            variant="ghost"
            className="w-10 h-10 rounded-lg text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </Button>

          <Button className="w-10 h-10 rounded-lg text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer">
            <Settings className="w-full h-full" />
          </Button>

          <Avatar className="w-10 h-10 border border-slate-100 rounded-full text-slate-900 hover:bg-slate-200  transition-colors  cursor-pointer">
            <AvatarFallback className="text-md">F</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
