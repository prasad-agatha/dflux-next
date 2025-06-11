// services
import { APIService } from "services";
// endpoints
import {
  CHARTS_LIST,
  PROJECT_CHARTS,
  PROJECTS,
  DELETE_CHART,
  SHARED_CHART,
  NEW_SHARED_CHARTS,
} from "lib/endpoints";
class ChartService extends APIService {
  // run sql query
  async getChartsData(): Promise<any> {
    try {
      const response = await this.get(CHARTS_LIST);
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error.response;
    }
  }
  getChartDetail(id: any): Promise<any> {
    return this.get(`${CHARTS_LIST}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getModelChartDetail(id: any): Promise<any> {
    return this.get(`${PROJECTS}data-models/charts/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getAllChart(): Promise<any> {
    return this.get(CHARTS_LIST)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getProjectCharts(projectId: any): Promise<any> {
    return this.get(PROJECT_CHARTS(projectId))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteChart(id: any): Promise<any> {
    return this.delete(DELETE_CHART(id));
  }

  saveChart(projectId: any, data: any): Promise<any> {
    return this.post(`${PROJECTS}${projectId}/charts/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  saveModelChart(projectId: any, data: any): Promise<any> {
    return this.post(`${PROJECTS}${projectId}/data-models/charts/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  updateChart(id: any, data: any): Promise<any> {
    return this.put(`${CHARTS_LIST}${id}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  updateModelChart(id: any, data: any): Promise<any> {
    return this.put(`${PROJECTS}data-models/charts/${id}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteModelChart(id: any): Promise<any> {
    return this.delete(`${PROJECTS}data-models/charts/${id}/`);
  }
  getSharedChartDetail(token: any): Promise<any> {
    return this.get(`${SHARED_CHART}?token=${token}`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  getSharedChart(sharedtoken: any): Promise<any> {
    // const header = {
    //   token: sharedtoken,
    //   "Content-Type": "application/json",
    // };
    return this.get(`${SHARED_CHART}?token=${sharedtoken}`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  shareChart(chart_id: any): Promise<any> {
    return this.get(`${CHARTS_LIST}${chart_id}/share`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  newSharedCharts(data: any): Promise<any> {
    return this.post(NEW_SHARED_CHARTS, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}
export default ChartService;
