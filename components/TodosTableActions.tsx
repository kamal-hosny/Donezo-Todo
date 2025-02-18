'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import Spinner from './Spinner'
import { deleteTodoAction } from '@/actions/todo.actions'
import TodoForm from './TodoForm'
import { ITodo } from '@/interfaces'

const TodosTableActions = ({ data }: { data: ITodo }) => {
    const [loading, setLoading] = useState(false)
    

    const onDelete = async () => {
        console.log(data.id);
        setLoading(true)
        await deleteTodoAction(data.id)
        setLoading(false)
    }
    
    return (
        <div className="flex items-center justify-end space-x-2"> 
            
            <TodoForm data={data} type='edit' />

            <Button 
                size={"icon"} 
                variant={"destructive"} 
                onClick={onDelete}
                className='flex justify-center items-center'
            >
                {loading ? <Spinner /> : <Trash size={16} />}
            </Button>
        </div>
    )
}

export default TodosTableActions