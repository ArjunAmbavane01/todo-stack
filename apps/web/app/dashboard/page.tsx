"use client"
import TodoList from "@/components/TodoList"
import ChannelSelector from "@/components/ChannelSelector"
import ConnectedUsers from "@/components/ConnectedUsers"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"
import { useEffect, useRef, useState } from "react"

export default function Dashboard() {

  const [username, setUsername] = useState('');
  const [connectedUsers,setConnectedUsers] = useState<string[]>([]);
  const socketRef = useRef<WebSocket|null>(null);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/login');
    }
    const getUsername = async () => {
      const res = await fetch('http://localhost:3001/user', {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('auth-token')}`,
        },
      })
      const data = await res.json();
      const username = (data.username as string).toUpperCase();
      setUsername(username);
    }
    getUsername();
  }, [])

  useEffect(()=>{
    const token = localStorage.getItem('auth-token');
    if(token){
      const socket = new WebSocket(`ws://localhost:8080?token=${token}`)
      socket.addEventListener('message',handleMessage)
      socketRef.current = socket;
    }

    return ()=>{
      socketRef.current?.removeEventListener('message',handleMessage)
    }
  },[])

  const handleMessage = (msg:MessageEvent)=>{
    const message = JSON.parse(msg.data);
    console.log(message)
    if(message.type === 'join'){
      setConnectedUsers([...connectedUsers,message.username]);
    }
    if(message.type === 'left'){
      const newConnectedUsers = connectedUsers.filter((name)=>name==message.username);
      setConnectedUsers([...newConnectedUsers]);
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TaskSync</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">{username}</span>
            <Link href="/">
              <Button variant="outline" size="sm" className="hover:cursor-pointer" onClick={async ()=>await signOut()}>
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with connected users */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Channel</h2>
                <ChannelSelector />
              </div>

              <div className="bg-card rounded-lg shadow-sm p-4">
                <ConnectedUsers users={connectedUsers} />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {username}</p>
            </div>

            <Tabs defaultValue="my-tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
                <TabsTrigger value="team-tasks">Team Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="my-tasks" className="space-y-4">
                <TodoList currentUser={username} showAddButton={true} title="My Tasks" />
              </TabsContent>

              {/* <TabsContent value="team-tasks" className="space-y-4">
                <TodoList initialTodos={teamTodos} currentUser={currentUser} showAddButton={false} title="Team Tasks" />
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

