export interface ITodo{
    id: string;
    title: string;
    body?: string | null;
    image?: string | null;
    completed: boolean;
    createdAt: Date;
    user_id?:  string 
}