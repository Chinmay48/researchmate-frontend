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


export type SearchType = "KEYWORD" | "SEMANTIC" | "HYBRID";

export type SessionStatus =
  | "CREATED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface CreateSessionRequest {
  title: string;
  query: string;
  searchType: SearchType;
}

export interface ResearchSession {
  id: string;
  projectId: string;
  title: string;
  query: string;
  searchType: SearchType;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}


