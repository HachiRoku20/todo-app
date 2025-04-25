"use client"
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@store/authStore";
import { Todo } from "@/types/Todo";
import api from "@utils/api";
import { useInitializeAuth } from "@utils/UseInitializeAuth";
import { ROUTES } from "@constants/routes";
import TodoComponent from "../components/TodoComponent";
import Modal from "../components/Modal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logoutUser } from "@utils/auth";
import InfiniteScroll from "react-infinite-scroll-component";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(ROUTES.TODOS);

  useInitializeAuth();

  const fetchTodos = useCallback(async () => {
    if (!token || !nextPageUrl) return;

    setLoading(true);
    try {
      const response = await api.get(nextPageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos((prev) => [...prev, ...response.data.results]);
      setNextPageUrl(response.data.next);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }, [token, nextPageUrl]);

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [fetchTodos, token]);

  const modalHandler = () => {
    setOpenModal((prev) => !prev);
    setTodoToEdit(null);
  };

  const handleSaveTodo = async (form: { title: string; text: string }) => {
    if (!token) return;
    setLoading(true);
  
    // Backup the original todo if we're editing
    const originalTodo = todoToEdit ? { ...todoToEdit } : null;
    let newTodo: Todo | null = null;
  
    try {
  
      if (todoToEdit) {
        // Updating an existing todo (patch)
        await api.patch(`${ROUTES.TODOS}${todoToEdit.id}/`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        newTodo = { ...todoToEdit, ...form };
  
        // Optimistically update the UI
        setTodos((prevTodos) => 
          prevTodos.map((todo) => (todo.id === newTodo?.id ? newTodo : todo))
        );
  
      } else {
        const response = await api.post(ROUTES.TODOS, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        newTodo = response.data;
  
        if (newTodo) {
          setTodos((prev) => [...prev, newTodo!]);
        }
      }
  
      modalHandler();
    } catch (error) {
      console.error("Error saving todo:", error);
      if (originalTodo) {
        // If editing, revert the edited todo back to the original state
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === originalTodo.id ? originalTodo : todo))
        );
      } else {
        // If creating a new todo, remove it from the list if the post failed
        setTodos((prev) => prev.filter((todo) => todo.id !== newTodo?.id));
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditTodo = (todo: Todo) => {
    setTodoToEdit(todo);
    setOpenModal(true);
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!token) return;
  
    setLoading(true);
    
    // Temporary backup of the todo that will be deleted
    const todoToDelete = todos.find((todo) => todo.id === todoId);
  
    try {
      await api.delete(`${ROUTES.TODOS}${todoId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Optimistic update: remove the todo from the state immediately
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      
    } catch (error) {
      console.error("Error deleting todo:", error);
      
      // If an error occurs, revert the delete operation and restore the todo to the state
      if (todoToDelete) {
        setTodos((prevTodos) => [...prevTodos, todoToDelete]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleMarkComplete = async (todoId: number) => {
    if (!token) return;
  
    setLoading(true);
    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: true } : todo
        )
      );
  
      await api.patch(`${ROUTES.TODOS}${todoId}/`, { completed: true }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  
    } catch (error) {
      console.error("Error marking todo complete:", error);
      
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: false } : todo
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="container mx-auto py-8 px-4 text-foreground h-auto min-h-screen">
      <div className="flex justify-end mb-6">
        <Button variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user}</h1>
        <Button onClick={modalHandler} className="self-center sm:self-auto">
          Add New Todo
        </Button>
      </div>

      <InfiniteScroll
        dataLength={todos.length}
        next={fetchTodos}
        hasMore={!!nextPageUrl}
        loader={<p className="text-center">Loading...</p>}
        endMessage={<p className="text-center">No more todos</p>}
      >
        <div className="space-y-4">
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <div key={index}>
                <TodoComponent
                  todo={todo}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                  onMarkComplete={handleMarkComplete}
                />
                <Separator />
              </div>
            ))
          ) : (
            <p className="text-center"></p>
          )}
        </div>
        {loading && <p className="text-center"></p>}
      </InfiniteScroll>

      <Modal
        isOpen={openModal}
        onClose={modalHandler}
        onSave={handleSaveTodo}
        todoToEdit={todoToEdit}
      />
    </div>
  );
};

export default Dashboard;
