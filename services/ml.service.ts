// services
import { APIService } from "services";
// endpoints
import {
  REGRESSION_LR,
  REGRESSION_DT,
  REGRESSION_RFR,
  REGRESSION_SVG,
  REGRESSION_XGB,
  MODELLING_TTS,
  MODELLING_LRM,
  MODELLING_SVC,
  MODELLING_DTC,
  MODELLING_RFC,
  MODELLING_XGBC,
  PREPROCESS_DTC,
  PREPROCESS_ARUC,
  PREPROCESS_RCC,
  PREPROCESS_MMS,
  PREPROCESS_AI,
  PREPROCESS_SS,
  PREPROCESS_TLE,
  PREPROCESSING,
  REGRESSION,
  CLASSIFICATION,
  TIMESERIES,
  LOAD_CSV,
  LOAD_DB,
  LABEL_ENCODING,
  PREDICTION,
  TIMESERIES_PREDICTION,
} from "lib/endpoints";

export default class MLService extends APIService {
  // Regression
  async linearRegression(data: any): Promise<any> {
    try {
      const response = await this.post(`${REGRESSION_LR}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async svgRegression(data: any): Promise<any> {
    try {
      const response = await this.post(`${REGRESSION_SVG}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async dtRegression(data: any): Promise<any> {
    try {
      const response = await this.post(`${REGRESSION_DT}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async rfRegression(data: any): Promise<any> {
    try {
      const response = await this.post(`${REGRESSION_RFR}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async xgbRegression(data: any): Promise<any> {
    try {
      const response = await this.post(`${REGRESSION_XGB}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  // Modelling
  async ttsModelling(data: any): Promise<any> {
    try {
      const response = await this.post(`${MODELLING_TTS}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async lrmModelling(data: any): Promise<any> {
    try {
      const response = await this.post(`${MODELLING_LRM}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async svcModelling(data: any): Promise<any> {
    try {
      const response = await this.post(`${MODELLING_SVC}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async dtcModelling(data: any): Promise<any> {
    try {
      const response = await this.post(`${MODELLING_DTC}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async rfcModelling(data: any): Promise<any> {
    try {
      const response = await this.post(`${MODELLING_RFC}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async xgbcModelling(data: any): Promise<any> {
    try {
      const response = await this.post(`${MODELLING_XGBC}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  // loading
  async loadDBData(data: any): Promise<any> {
    try {
      const response = await this.post(`${LOAD_DB}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async loadCSV(data: any): Promise<any> {
    try {
      const response = await this.post(`${LOAD_CSV}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  // Pre Processing
  async dtcPreprocess(data: any): Promise<any> {
    try {
      const response = await this.post(`${PREPROCESS_DTC}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async arucPreprocess(data: any): Promise<any> {
    try {
      const response = await this.post(`${PREPROCESS_ARUC}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async aiPreprocess(data: any): Promise<any> {
    try {
      const response = await this.post(`${PREPROCESS_AI}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async rccPreprocess(data: any): Promise<any> {
    try {
      const response = await this.post(`${PREPROCESS_RCC}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async tlePreprocess(data: any): Promise<any> {
    try {
      const response = await this.post(`${PREPROCESS_TLE}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async ssPreprocess(data: any): Promise<any> {
    try {
      const response = await this.post(`${PREPROCESS_SS}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  async minmaxPreprocess(data: any): Promise<any> {
    try {
      const response = await this.post(`${PREPROCESS_MMS}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  // create new project
  preProcessing(data: any): Promise<any> {
    return this.post(PREPROCESSING, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  labelEncoding(data: any): Promise<any> {
    return this.post(LABEL_ENCODING, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  regression(data: any): Promise<any> {
    return this.post(REGRESSION, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  classification(data: any): Promise<any> {
    return this.post(CLASSIFICATION, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  timeseries(data: any): Promise<any> {
    return this.post(TIMESERIES, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  prediction(modelId: any, data: any): Promise<any> {
    return this.post(PREDICTION(modelId), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  timeSeriesPrediction(modelId: any, data: any): Promise<any> {
    return this.post(TIMESERIES_PREDICTION(modelId), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}
