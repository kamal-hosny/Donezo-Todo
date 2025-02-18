"use client";

import { createTodoAction, updateTodoAction } from "@/actions/todo.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TodoFormValues, todoFormSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pen, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";

import { Textarea } from "./ui/textarea";
import { ITodo } from "@/interfaces";
import { Checkbox } from "./ui/checkbox";

type TodoFormProps = {
  userId?: string | null
  data?: ITodo;
  type?: "add" | "edit";
};

const TodoForm = ({ type = "add", data, userId }: TodoFormProps) => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(data?.image || null);

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: data
      ? {
          title: data?.title,
          body: data?.body as string,
          image: data?.image as string,
          completed: data?.completed,
        }
      : {
          title: "",
          body: "",
          image: "",
          completed: false,
        },
    mode: "onChange",
  });

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      form.setValue("image", data.url);
      setPreview(data.url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: TodoFormValues) => {
    try {
      if (type === "add") {
        await createTodoAction({
          title: values.title,
          body: values.body,
          image: values.image,
          completed: values.completed,
          user_id: userId as string
        });
      } else if (data?.id) {
        await updateTodoAction({
          id: data.id,
          data: values,
        });
      }

      form.reset();
      setOpen(false);
      setPreview(null);
    } catch (error) {
      console.error("Submission failed:", error);
      alert(`Todo ${type === "add" ? "creation" : "update"} failed`);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "add" ? (
          <Button className="w-fit self-end flex">
            <Plus size={14} className="mr-1" />
            New Todo
          </Button>
        ) : (
          <Button size="icon" variant="secondary">
<Pen size={16} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Create New Todo" : "Edit Todo"}
          </DialogTitle>
          <DialogDescription>
            {type === "add"
              ? "Add a new todo item to your list. Click save when you're done."
              : "Modify your todo item. Click save to update."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <FormItem>
                <FormLabel>Image (Optional)</FormLabel>
                <div className="flex flex-col justify-center items-center gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md border-border border-2 border-dashed "
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>

              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Go to gym" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add details about your todo"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Completed Field */}

              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean) =>
                          field.onChange(checked)
                        }
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormLabel className="!m-2">Completed</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden Image URL Field */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isUploading || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Todo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
