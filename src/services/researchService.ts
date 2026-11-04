import api from "../lib/api";
import type { CreateProjectRequest, CreateSessionRequest, ResearchProject, ResearchSession } from "../types/research";
export const createProject=async(
    request:CreateProjectRequest
):Promise<void>=>{
    await api.post("/projects",request)
}


export const getMyProjects=async():Promise<ResearchProject[]>=>{
   const response=  await api.get<ResearchProject[]>("/projects")
   return response.data;
}

export const getProject=async(projectId:string):Promise<ResearchProject>=>{
    const response=await api.get<ResearchProject>(`/projects/${projectId}`)
    return response.data;
}

export const getProjectSessions=async(projectId:string):Promise<ResearchSession[]>=>{
    const response=await api.get<ResearchSession[]>(`/projects/${projectId}/sessions`)
    return response.data;
}


export const createSession=async(projectId:string,request:CreateSessionRequest):Promise<ResearchSession>=>{
    const response=await api.post<ResearchSession>(`/projects/${projectId}/sessions`,request);
    return response.data;
}