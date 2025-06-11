import axios, { AxiosPromise } from "axios";

abstract class LambdaAPIService {
  //Passing bearer for all api calls
  getAxiosHeaders(): any {
    return {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
  }

  // Axios post method

  post(url: string, data = {}): AxiosPromise<any> {
    return axios({
      method: "POST",
      url,
      data,
      headers: this.getAxiosHeaders(),
    });
  }
}

export default LambdaAPIService;
