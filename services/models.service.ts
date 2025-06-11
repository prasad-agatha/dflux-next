// services
import { APIService } from "services";
// endpoints
// endpoints
import { SAVE_MODEL, DELETE_MODEL, GET_MODEL, UPDATE_MODEL } from "lib/endpoints";
class ModelService extends APIService {
  getModels(projectId: any): Promise<any> {
    return this.get(SAVE_MODEL(projectId))
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  async saveModel(projectId: any, data: any): Promise<any> {
    try {
      const response = await this.post(SAVE_MODEL(projectId), data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  deleteModel(project_id: any, modelId: any): Promise<any> {
    return this.delete(DELETE_MODEL(project_id, modelId))
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  getModel(project_id: any, modelId: any): Promise<any> {
    return this.get(GET_MODEL(project_id, modelId))
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  updateModel(project_id: any, modelId: any, data: any): Promise<any> {
    return this.put(UPDATE_MODEL(project_id, modelId), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}
export default ModelService;
