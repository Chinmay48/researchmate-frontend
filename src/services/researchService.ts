import api from "../lib/api";
import type { CreateProjectRequest, ResearchProject } from "../types/research";
export const createProject=async(
    request:CreateProjectRequest
):Promise<void>=>{
    await api.post("/projects",request)
}


export const getMyProjects=async():Promise<ResearchProject[]>=>{
   const response=  await api.get<ResearchProject[]>("/projects")
   return response.data;
}