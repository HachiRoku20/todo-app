"use client"
import React, { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Shadcn Button component
import { Input } from "@/components/ui/input"; // Shadcn Input component
import { Card, CardContent } from "@/components/ui/card"; // Shadcn Card components

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoData: { title: string; text: string }) => void;
  todoToEdit: { title: string; text: string } | null;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, onSave, todoToEdit }) => {
  const [form, setForm] = useState<{ title: string; text: string }>({
    title: "",
    text: "",
  });

  useEffect(() => {
    if (todoToEdit) {
      setForm({ title: todoToEdit.title, text: todoToEdit.text });
    }
  }, [todoToEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setForm({ title: "", text: "" });
  };

  const handleCancel = () => {
    setForm({ title: "", text: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-center">
            {todoToEdit ? "Edit Todo" : "Add New Todo"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="title"
              placeholder="Todo Title"
              value={form.title}
              onChange={handleInputChange}
              className="input input-bordered border-neutral-300 bg-white text-black w-full"
            />
            <Input
              name="text"
              placeholder="Description"
              value={form.text}
              onChange={handleInputChange}
              className="input input-bordered border-neutral-300 bg-white text-black w-full"
            ></Input>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="submit" className="w-28">
                {todoToEdit ? "Update Todo" : "Save Todo"}
              </Button>
              <Button
                variant="destructive"
                type="button"
                className="w-28"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Modal;
