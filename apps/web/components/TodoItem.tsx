"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Todo } from "@/components/TodoList"
import { Label } from "@/components/ui/label"

interface TodoItemProps {
  todo: Todo
  isCurrentUser: boolean
  onToggleComplete: () => void
  onEdit: () => void
  onDelete: () => void
  isEditing: boolean
  onSaveEdit: (updatedTodo: Todo) => void
  onCancelEdit: () => void
}

export default function TodoItem({
  todo,
  isCurrentUser,
  onToggleComplete,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
}: TodoItemProps) {
  const [editedTodo, setEditedTodo] = useState({
    title: todo.title,
    description: todo.description,
  })

  const handleSaveEdit = () => {
    if (!editedTodo.title.trim()) return

    onSaveEdit({
      ...todo,
      title: editedTodo.title,
      description: editedTodo.description,
    })
  }

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-title-${todo.id}`}>Title</Label>
              <Input
                id={`edit-title-${todo.id}`}
                value={editedTodo.title}
                onChange={(e) => setEditedTodo({ ...editedTodo, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-description-${todo.id}`}>Description</Label>
              <Textarea
                id={`edit-description-${todo.id}`}
                value={editedTodo.description}
                onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancelEdit}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSaveEdit}>
            <Check className="h-4 w-4 mr-1" /> Save
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={`${todo.completed ? "bg-muted" : ""}`}>
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={onToggleComplete}
            className="mt-1"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {todo.title}
                </label>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>By {todo.username}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
              {isCurrentUser && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </div>
            {todo.description && (
              <p className={`text-sm ${todo.completed ? "text-muted-foreground line-through" : ""}`}>
                {todo.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

