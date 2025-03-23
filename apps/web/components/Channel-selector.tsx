"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, Plus } from "lucide-react"

const CHANNELS = ["general", "work", "personal", "team-alpha", "team-beta"]

export default function ChannelSelector() {
  const [currentChannel, setCurrentChannel] = useState("general")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newChannel, setNewChannel] = useState("")

  const handleChannelChange = (channel: string) => {
    setCurrentChannel(channel)
  }

  const handleCreateChannel = () => {
    if (!newChannel.trim()) return
    setCurrentChannel(newChannel)
    setNewChannel("")
    setIsDialogOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {currentChannel}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {CHANNELS.map((channel) => (
            <DropdownMenuItem key={channel} onClick={() => handleChannelChange(channel)}>
              {channel}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Create channel</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input placeholder="Channel name" value={newChannel} onChange={(e) => setNewChannel(e.target.value)} />
            <Button onClick={handleCreateChannel} className="w-full">
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

