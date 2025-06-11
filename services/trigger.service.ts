// services
import { APIService } from "services";
// endpoints
import { TRIGGERS, TRIGGERS_OPTIONS, PROJECTS, TRIGGERS_OUTPUT } from "lib/endpoints";

class TriggerService extends APIService {
  createTrigger(data: any, projectId: any): Promise<any> {
    return this.post(TRIGGERS(projectId), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getTriggers(projectId: number): Promise<any> {
    return this.get(TRIGGERS(projectId))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteTrigger(triggerId: number): Promise<any> {
    return this.delete(TRIGGERS_OPTIONS(triggerId))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getTrigger(id: number): Promise<any> {
    return this.get(TRIGGERS_OPTIONS(id))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getTriggerOutput(id: number): Promise<any> {
    return this.get(TRIGGERS_OUTPUT(id))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  updateTrigger(data: any, id: any): Promise<any> {
    return this.put(TRIGGERS_OPTIONS(id), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  createChartTrigger(projectId: any, data: any): Promise<any> {
    return this.post(`${PROJECTS}${projectId}/charts/triggers/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteChartTrigger(triggerId: number): Promise<any> {
    return this.delete(`${PROJECTS}charts/triggers/${triggerId}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  updateChartTrigger(triggerId: any, data: any): Promise<any> {
    return this.put(`${PROJECTS}charts/triggers/${triggerId}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}

export default TriggerService;
