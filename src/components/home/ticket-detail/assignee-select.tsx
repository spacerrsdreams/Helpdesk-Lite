import { useState } from "react";

import type { UserT } from "@/schemas/user.schemas";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, User, X } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AssigneeSelectProps {
  value?: number;
  users: UserT[];
  usersMap: Map<number, UserT>;
  onChange: (assigneeId: number | undefined) => void;
  disabled?: boolean;
}

export function AssigneeSelect({ value, users, usersMap, onChange, disabled }: AssigneeSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedUser = value ? usersMap.get(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {selectedUser ? selectedUser.name : "Unassigned"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="unassigned"
                onSelect={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
                <X className="text-muted-foreground mr-2 h-4 w-4" />
                Unassigned
              </CommandItem>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    onChange(user.id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === user.id ? "opacity-100" : "opacity-0")} />
                  <User className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
