//Modelado del libro
export interface Book {
    id: number;
    title: string;
    author: string;
    cover: string;
    description?: string;
    category: string;
    price: number;
}
