// services
import { APIService } from "services";
// endpoints
import {
  PROJECTS,
  INVITE_USER,
  USERS,
  PROJECT_DASHBOARDS,
  VERIFY_USER,
  UPDATE_USER,
  DELETE_USER,
} from "lib/endpoints";

class ProjectsService extends APIService {
  // projects list
  getProjectsData(): Promise<any> {
    return this.get(PROJECTS)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response;
      });
  }
  // project details
  getProjectData(id: any): Promise<any> {
    return this.get(`${PROJECTS}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response;
      });
  }
  // create new project
  createProject(data: any): Promise<any> {
    return this.post(PROJECTS, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  // update project
  updateProject(id: any, data: any): Promise<any> {
    return this.put(`${PROJECTS}${id}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // delete project
  deleteProject(id: any): Promise<any> {
    return this.delete(`${PROJECTS}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  addToTeam(data: any): Promise<any> {
    return this.post(PROJECTS, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  inviteUser(id: any, data: any): Promise<any> {
    return this.post(INVITE_USER(id), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  updateUser(project_id: any, id: any, data: any): Promise<any> {
    return this.put(UPDATE_USER(project_id, id), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteUser(project_id: any, id: any): Promise<any> {
    return this.delete(DELETE_USER(project_id, id))
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  verify_User(data: any): Promise<any> {
    return this.post(VERIFY_USER, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  acceptInvite(id: any, data: any): Promise<any> {
    return this.post(`${PROJECTS}${id}/members/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  projectMembers(id: any): Promise<any> {
    return this.get(`${PROJECTS}${id}/members/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getUsers(id: any): Promise<any> {
    return this.get(USERS(id))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getProjectDashboards(id: any): Promise<any> {
    return this.get(PROJECT_DASHBOARDS(id))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}
export default ProjectsService;
