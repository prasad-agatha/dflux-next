import axios from "axios";
// import Router from "next/router";
import { APIService } from "services";
import {
  SIGN_IN,
  USER_DATA,
  CREATE_USER,
  RESET_PASSWORD,
  PASSWORD_RESET,
  CHANGE_PASSWORD,
  CONTACT_SALES,
  SUPPORT_REQUEST,
  // USER_LIST,
} from "lib/endpoints";

class AuthorizationService extends APIService {
  // users list
  getUsersData(): Promise<any> {
    return this.get(`${USER_DATA}`)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  // // userlist with active/inactive data
  // getUsersList(search: any): Promise<any> {
  //   return this.get(USER_LIST(search))
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .catch((error: any) => {
  //       throw error.response.data;
  //     });
  // }

  // user sign in
  userSignIN(data: any): Promise<any> {
    return this.post(`${SIGN_IN}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // new user
  createUser(data: any): Promise<any> {
    return this.post(`${CREATE_USER}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  // verify user
  authenticateUser(access: string, refresh: string): void {
    this.setAccessToken(access);
    this.setRefreshToken(refresh);
   

    // access !== undefined ? Router.push("/projects") : null;
  }
  // edit user
  async editUser(data: any): Promise<any> {
    return this.put(`${USER_DATA}`, data)
      .then((response) => {
        return response.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  resetPassword(data: any): Promise<any> {
    return this.post(`${RESET_PASSWORD}`, data)
      .then((response) => {
        return response.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  confirmPassword(data: any): Promise<any> {
    return this.post(`${PASSWORD_RESET}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  changePassword(data: any, id: any): Promise<any> {
    return this.post(CHANGE_PASSWORD(id), data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  logout() {
    this.purgeAuth();
  }

  // contact sales
  contactSales(data: any): Promise<any> {
    return this.post(`${CONTACT_SALES}`, data)
      .then((res) => {
        return res;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }

  // support request
  supportRequest(data: any): Promise<any> {
    return this.post(`${SUPPORT_REQUEST}`, data)
      .then((res) => {
        return res;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}

export default AuthorizationService;
