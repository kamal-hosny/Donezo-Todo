import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITodo } from "@/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import TodosTableActions from "./TodosTableActions";
export function TodosTable({ todos }: { todos: ITodo[] }) {


  return (
    <Table>
      <TableCaption>A list of your todos.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Completed</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos?.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell className="font-medium">{todo?.id}</TableCell>
            <TableCell>{todo?.title}</TableCell>
            <TableCell>
              <Avatar>
                <AvatarImage src={todo?.image ?? "https://dummyimage.com/200x200"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>
              {todo.completed ? (
                <Badge>&quot;Completed&quot;</Badge>
              ) : (
<Badge variant={"secondary"}>&quot;Uncompleted&quot;</Badge>
              )}
            </TableCell>
            <TableCell >
             <TodosTableActions data={todo} /> 
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow >
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">{!todos?.length ? "0" : todos?.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
