"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ConnectedUsers({ users }: {users:string[]}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Connected Users</h3>
        <Badge variant="outline" className="text-xs"> online </Badge>
      </div>

      <div className="space-y-3">
        {users.map((user,idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8 bg-slate-300">
                <AvatarImage src={''} alt={user} />
                <AvatarFallback>{user.charAt(0)}</AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user}</p>
              <p className="text-xs text-muted-foreground capitalize">active</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

