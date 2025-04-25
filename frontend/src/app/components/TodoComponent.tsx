import React from "react";
import { Todo } from "@/types/Todo";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, Trash2 } from "lucide-react";

interface TodoComponentProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onMarkComplete: (id: number) => void;
}

const TodoComponent: React.FC<TodoComponentProps> = ({ todo, onEdit, onDelete, onMarkComplete }) => {
  const handleMarkComplete = () => {
    if (!todo.completed) {
      console.log("Marking complete", todo.id);
      onMarkComplete(todo.id);
    }
  };

  return (
    <Card
      className="w-full hover:bg-muted/50 transition-colors cursor-pointer mt-4"
      onClick={() => onEdit(todo)}
    >
      <CardHeader className="flex flex-row justify-between items-start">
        <div className="flex items-start gap-3 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkComplete()
            }}
            className="mt-1 text-muted-foreground hover:text-primary"
          >
            <Circle className={`h-5 w-5 ${todo.completed ? 'fill-primary text-primary' : ''}`} />
          </button>
          <div className="flex-1">
            <div className={`font-semibold truncate text-lg ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
              {todo.title}
            </div>
            <p className={`text-sm break-words ${todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
              {todo.text}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="text-destructive hover:text-red-600"
        >
          <Trash2 className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive" />
        </button>
      </CardHeader>
      <CardContent>
        <Badge variant={todo.completed ? "default" : "secondary"}>
          {todo.completed ? "Completed" : "Pending"}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default TodoComponent;
