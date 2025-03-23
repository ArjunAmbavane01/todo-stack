"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type User = {
  id: string
  name: string
  status: "active" | "idle" | "offline"
  avatar: string
}

interface ConnectedUsersProps {
  users: User[]
}

export default function ConnectedUsers({ users }: ConnectedUsersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Connected Users</h3>
        <Badge variant="outline" className="text-xs">
          {users.filter((user) => user.status !== "offline").length} online
        </Badge>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                  user.status === "active" ? "bg-green-500" : user.status === "idle" ? "bg-yellow-500" : "bg-gray-300"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

