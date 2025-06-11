// services
import { APIService } from "services";
// endpoints
import {
  DASHBOARDS,
  Dashboard_LIST,
  CREATE_DASHBOARD,
  PROJECT_DASHBOARDS,
  SHARED_DASHBOARD,
  updateDashboard,
  NEW_SHARED_DASHBOARD,
} from "lib/endpoints";

class DashboardService extends APIService {
  createDashboard(projectId: any, data: any): Promise<any> {
    return this.post(CREATE_DASHBOARD(projectId), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  updateDashboard(id: any, data: any): Promise<any> {
    return this.put(`${updateDashboard}${id}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getDashboard(id: any): Promise<any> {
    return this.get(`${DASHBOARDS}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getDashboards(project_id: any): Promise<any> {
    return this.get(Dashboard_LIST(project_id))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getSharedDashboard(sharedtoken: any): Promise<any> {
    // const header = {
    //   token: sharedtoken,
    //   "Content-Type": "application/json",
    // };
    return this.get(`${SHARED_DASHBOARD}?token=${sharedtoken}`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getProjectDashboard(projectId: any): Promise<any> {
    return this.get(PROJECT_DASHBOARDS(projectId))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  shareDashboard(dashboard_id: any): Promise<any> {
    return this.get(`${DASHBOARDS}${dashboard_id}/share`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteDashboard(dashboard_id: any): Promise<any> {
    return this.delete(`${DASHBOARDS}${dashboard_id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  updateDashboardChart(chartId: any, data: any): Promise<any> {
    return this.put(`${DASHBOARDS}charts/${chartId}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  newSharedDashboard(data: any): Promise<any> {
    return this.post(NEW_SHARED_DASHBOARD, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}
export default DashboardService;
