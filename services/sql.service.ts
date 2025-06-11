// services
import { APIService } from "services";
// endpoints
import { SQL_QUERY, SAVE_Query, SCHEMA_TABLES, QUERIES, QUERYLIST } from "lib/endpoints";

class QueryService extends APIService {
  sqlQuery(data: any): Promise<any> {
    return this.post(data.domain + SQL_QUERY, data)
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // run sql query
  runQuery(data: any): Promise<any> {
    return this.post(QUERIES, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // save query
  saveQuery(data: any, id: any): Promise<any> {
    return this.post(SAVE_Query(id), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // update query
  // updateQuery(id: any, data: any): Promise<any> {
  //   return this.put(`${QUERIES}${id}/`, data)
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .catch((error:any) => {
  //       throw error.response.data;
  //     });
  // }
  async updateQuery(id: any, data: any): Promise<any> {
    try {
      const response = await this.put(`${QUERIES}${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
  // saved queries list
  savedQueries(id: any): Promise<any> {
    return this.get(QUERYLIST(id))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // query details
  getQueryDetails(id: any): Promise<any> {
    return this.get(`${QUERIES}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // delete saved query
  deleteQuery(id: any): Promise<any> {
    return this.delete(`${QUERIES}${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // schema tables of connection
  getSchemaTableDetails(id: any): Promise<any> {
    return this.post(SCHEMA_TABLES(id))
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}
export default QueryService;
