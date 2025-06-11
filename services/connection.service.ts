// services
import { APIService } from "services";
// endpoints
import {
  CONNECTIONS,
  EXCELS,
  JSONS,
  CONNECTIONS_HOME,
  TEST_CONNECTION,
  DUMP_EXCEL,
  GET_SCHEMAS,
  GET_SCHEMAS_EXCEL,
  GET_SCHEMAS_JSON,
  DUMP_JSON,
  TEST_SNOWFLAKE,
  DUMP_JSON_FILE,
  GOOGLE_SHEET_PARSER,
} from "lib/endpoints";

class ConnectionsService extends APIService {
  // connections data
  getConnectionsData(projectId: any): Promise<any> {
    return this.get(CONNECTIONS(projectId))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getExcelsData(projectId: any): Promise<any> {
    return this.get(EXCELS(projectId))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getJsonsData(projectId: any): Promise<any> {
    return this.get(JSONS(projectId))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getConnectionData(id: any): Promise<any> {
    return this.get(`${CONNECTIONS_HOME}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // create new connection
  createConnection(data: any, projectId: any): Promise<any> {
    return this.post(CONNECTIONS(projectId), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  dumpExcel(data: any, projectId: any): Promise<any> {
    return this.post(DUMP_EXCEL(projectId), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // test connection
  testConnection(data: any): Promise<any> {
    return this.post(`${TEST_CONNECTION}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  testSnowFlake(data: any): Promise<any> {
    return this.post(`${TEST_SNOWFLAKE}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // delete connection
  deleteConnection(id: number): Promise<any> {
    return this.delete(`${CONNECTIONS_HOME}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteExcelData(id: number): Promise<any> {
    return this.delete(`api/excel/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // update connection
  updateConnection(id: any, data: any): Promise<any> {
    return this.put(`${CONNECTIONS_HOME}${id}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  getSchemas(connection_id: any, excel_id?: any, json_id?: any): Promise<any> {
    if (excel_id) {
      return this.get(`${GET_SCHEMAS_EXCEL(connection_id, excel_id)}`)
        .then((res) => {
          return res.data;
        })
        .catch((error: any) => {
          throw error.response.data;
        });
    } else if (json_id) {
      return this.get(`${GET_SCHEMAS_JSON(connection_id, json_id)}`)
        .then((res) => {
          return res.data;
        })
        .catch((error: any) => {
          throw error.response.data;
        });
    } else {
      return this.get(`${GET_SCHEMAS(connection_id)}`)
        .then((res) => {
          return res.data;
        })
        .catch((error: any) => {
          throw error.response.data;
        });
    }
  }
  dumpJSON(data: any, projectId: any): Promise<any> {
    return this.post(`${DUMP_JSON(projectId)}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  parseSheet(data: any): Promise<any> {
    return this.post(GOOGLE_SHEET_PARSER, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  deleteJSON(id: number): Promise<any> {
    return this.delete(`api/json/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  dumpJSONFile(data: any): Promise<any> {
    return this.post(DUMP_JSON_FILE, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}

export default ConnectionsService;
