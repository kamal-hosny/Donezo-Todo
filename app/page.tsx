import { getUserTodoListAction } from "@/actions/todo.actions";
import TodoForm from "@/components/TodoForm";
import { TodosTable } from "@/components/TodosTable";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {


  const { userId, redirectToSignIn } = await auth()

  console.log(userId);
  
  if (!userId) return redirectToSignIn()
  const todos = await getUserTodoListAction({user_id: userId})

  return (
    <main className="container space-y-2">
      <div className="mx-auto flex w-full lg:w-3/4 flex-col justify-center space-y-4 mt-10">
      <TodoForm userId={userId} />
      <TodosTable todos={todos} />
      </div>
    </main>
  );
}
