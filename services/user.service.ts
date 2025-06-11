import { APIService } from "services";
// cookie
import cookie from "js-cookie";

//TODO: Add url in endpoints
class UserService extends APIService {
  // Getting access token from cookie
  getAccessToken(): string | undefined {
    return cookie.get("accessToken");
  }

  // Getting refresh token from cookie
  getRefreshToken(): string | undefined {
    return cookie.get("refreshToken");
  }
}

export default UserService;
