"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Plus } from "lucide-react"
import TodoItem from "@/components/TodoItem"
import { Label } from "@/components/ui/label"

export type Todo = {
  id: string
  title: string
  description: string
  username: string
  completed: boolean
  createdAt: string
}

interface TodoListProps {
  initialTodos: Todo[]
  currentUser: string
  showAddButton?: boolean
  title?: string
}

export default function TodoList({ initialTodos, currentUser, showAddButton = true, title = "Tasks" }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTodo, setNewTodo] = useState({ title: "", description: "" })
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description,
      username: currentUser,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTodos([todo, ...todos])
    setNewTodo({ title: "", description: "" })
    setIsAdding(false)
  }

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    setEditingTodo(null)
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleToggleComplete = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed }
    handleUpdateTodo(updatedTodo)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>{title}</span>
        </h2>
        {showAddButton && (
          <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "secondary" : "default"}>
            {isAdding ? (
              "Cancel"
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Todo
              </>
            )}
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-lg font-medium">Add New Todo</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="Add details..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddTodo} className="ml-auto">
              Add Todo
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No todos yet. {showAddButton ? "Create your first one!" : "Your team hasn't added any tasks yet."}
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isCurrentUser={todo.username === currentUser}
              onToggleComplete={() => handleToggleComplete(todo)}
              onEdit={() => setEditingTodo(todo)}
              onDelete={() => handleDeleteTodo(todo.id)}
              isEditing={editingTodo?.id === todo.id}
              onSaveEdit={(updatedTodo) => handleUpdateTodo(updatedTodo)}
              onCancelEdit={() => setEditingTodo(null)}
            />
          ))
        )}
      </div>
    </div>
  )
}

