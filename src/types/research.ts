export interface CreateProjectRequest{
    title: string;
    description: string;
    researchQuestion: string;
}

export interface ResearchProject{
    id:string;
    title:string;
    description:string;
    researchQuestion:string;
    createdAt:string;
    updatedAt:string;
}