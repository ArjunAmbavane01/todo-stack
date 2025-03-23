import TodoList from "@/components/todo-list"
import ChannelSelector from "@/components/Channel-selector"
import ConnectedUsers from "@/components/Connected-users"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Mock data for UI demonstration
const mockTodos = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finish the proposal document for the new client project",
    username: "John Doe",
    completed: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Check and approve team members' code changes",
    username: "John Doe",
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Prepare for meeting",
    description: "Create slides for tomorrow's client presentation",
    username: "Jane Smith",
    completed: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Update the API documentation with new endpoints",
    username: "Alex Johnson",
    completed: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "5",
    title: "Fix login bug",
    description: "Address the authentication issue reported by users",
    username: "Sarah Williams",
    completed: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
]

// Mock connected users
const connectedUsers = [
  { id: "1", name: "John Doe", status: "active", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "2", name: "Jane Smith", status: "active", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "3", name: "Alex Johnson", status: "idle", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "4", name: "Sarah Williams", status: "active", avatar: "/placeholder.svg?height=40&width=40" },
]

export default function Dashboard() {
  const currentUser = "John Doe"
  const myTodos = mockTodos.filter((todo) => todo.username === currentUser)
  const teamTodos = mockTodos.filter((todo) => todo.username !== currentUser)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TaskSync</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">{currentUser}</span>
            <Link href="/">
              <Button variant="outline" size="sm">
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
              <p className="text-muted-foreground">Welcome back, {currentUser}</p>
            </div>

            <Tabs defaultValue="my-tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
                <TabsTrigger value="team-tasks">Team Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="my-tasks" className="space-y-4">
                <TodoList initialTodos={myTodos} currentUser={currentUser} showAddButton={true} title="My Tasks" />
              </TabsContent>

              <TabsContent value="team-tasks" className="space-y-4">
                <TodoList initialTodos={teamTodos} currentUser={currentUser} showAddButton={false} title="Team Tasks" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

