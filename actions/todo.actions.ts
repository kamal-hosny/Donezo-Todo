'use server'; 

import { ITodo } from "@/interfaces";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const getUserTodoListAction = async ({user_id}: {user_id : string | null}): Promise<Array<ITodo>> => {
  return await prisma.todo.findMany({ orderBy: { createdAt: "desc" },where:{ user_id: user_id ?? undefined } });
};

export const createTodoAction = async (data: Omit<ITodo, "id" | "createdAt">) => {
 try {
  await prisma.todo.create({ 
    data: {
      ...data,
      user_id: data.user_id as string
    }
   });
  revalidatePath("/");
 } catch (error) {
  throw new Error("Something went wrong", error as ErrorOptions | undefined)
 }
};

export const deleteTodoAction = async (id: string) => {
  await prisma.todo.delete({ where: { id } });
  revalidatePath("/");
};

export const updateTodoAction = async ({
  id,
  data,
}: {
  id: string;
  data: Omit<ITodo, "id" | "createdAt">;
}) => {
  try {
    await prisma.todo.update({
      where: { id },
      data: {
        title: data.title,
        body: data.body,
        image: data.image,
        completed: data.completed,
      },
    });
    revalidatePath("/");
  }
  catch (error) {
    throw new Error("Something went wrong", error as ErrorOptions | undefined)
  }
};