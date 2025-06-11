// services
import { APIService } from "services";
// endpoints
import { TEAM, TEAMS, TEAM_MEMBERS, PROJECT_TEAM, PROJECT_TEAMS } from "lib/endpoints";

class TeamsService extends APIService {
  // teams data
  async getTeamsData(): Promise<any> {
    try {
      const response = await this.get(TEAMS);
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error.response;
    }
  }
  // project teams -- respective to same project
  async getProjectTeamsData(): Promise<any> {
    try {
      const response = await this.get(PROJECT_TEAMS);
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error.response;
    }
  }
  // team data -- only 1 team at a time
  async getTeamData(n: any): Promise<any> {
    try {
      const response = await this.get(TEAM(n));
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error.response;
    }
  }
  // team member details
  async getTeamMembersData(n: any): Promise<any> {
    try {
      const response = await this.get(TEAM_MEMBERS(n));
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error.response;
    }
  }
  // project team details
  async getProjectTeamData(n: any): Promise<any> {
    try {
      const response = await this.get(PROJECT_TEAM(n));
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error.response;
    }
  }
  getAllTeams(): Promise<any> {
    return this.get(TEAMS)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
  createTeam(data: any): Promise<any> {
    return this.post(TEAMS, data)
      .then((res) => {
        return res.data;
      })
      .catch((error: any) => {
        throw error.response.data;
      });
  }
}
export default TeamsService;
