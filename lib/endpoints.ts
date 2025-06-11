export const BACKEND_API = process.env.API_SERVER;
export const TIME_SERIES_API = process.env.TIME_SERIES_URL;

export const SIGN_IN = `${BACKEND_API}api/signin/`;
export const CREATE_USER = `${BACKEND_API}api/users/`;
//contact sales
export const CONTACT_SALES = `${BACKEND_API}api/contact/sales/`;
//support request
export const SUPPORT_REQUEST = `${BACKEND_API}api/support/`;

export const USER_DATA = `${BACKEND_API}api/users/me/`;
// export const USER_LIST = (search: any) => `${BACKEND_API}api/userslist/?search=${search}`;

export const RESET_PASSWORD = `${BACKEND_API}api/password-reset/`;
export const PASSWORD_RESET = `${BACKEND_API}api/password-reset/confirm/`;
export const Query_SQL = `${BACKEND_API}api/query/`;
export const SQL_QUERY = `/api/query/`;
export const QUERIES = `${BACKEND_API}api/queries/`;
export const QUERYLIST = (projectId: any) => `${BACKEND_API}api/project/${projectId}/queries/`;
export const SAVE_Query = (projectId: any) => `${BACKEND_API}api/project/${projectId}/queries/`;
export const SCHEMA_TABLES = (connectionId: any) =>
  `${BACKEND_API}api/connections/${connectionId}/schema/`;
export const CONNECTIONS_HOME = `${BACKEND_API}api/connections/`;
export const GET_SCHEMAS = (connectionId: any) =>
  `${BACKEND_API}api/connections/${connectionId}/schema/`;
export const GET_SCHEMAS_EXCEL = (connectionId: any, excel_id: any) =>
  `${BACKEND_API}api/connections/${connectionId}/schema/?excel_id=${excel_id}`;
export const GET_SCHEMAS_JSON = (connectionId: any, json_id: any) =>
  `${BACKEND_API}api/connections/${connectionId}/schema/?json_id=${json_id}`;
export const TEST_CONNECTION = `${BACKEND_API}api/test/connection/`;
export const TEST_SNOWFLAKE = `${BACKEND_API}api/test/snowflake/connection/`;
export const GOOGLE_SHEET_PARSER = `${BACKEND_API}api/google-sheet/parser/`;
export const DUMP_EXCEL = (projectId: any) => `${BACKEND_API}api/projects/${projectId}/excel/`;
export const DUMP_JSON = (projectId: any) => `${BACKEND_API}api/projects/${projectId}/json/`;
export const DELETE_JSON = (projectId: any) => `${BACKEND_API}api/json/${projectId}`;
export const DUMP_JSON_FILE = `${BACKEND_API}api/assets/`;
export const CONNECTIONS = (projectId: any) =>
  `${BACKEND_API}api/projects/${projectId}/connections/`;
export const EXCELS = (projectId: any) => `${BACKEND_API}api/projects/${projectId}/excel/`;
export const JSONS = (projectId: any) => `${BACKEND_API}api/projects/${projectId}/json/`;
export const CHANGE_PASSWORD = (userId: any) => `${BACKEND_API}api/change-password/${userId}/`;
export const PROJECTS = `${BACKEND_API}api/projects/`;
export const CHARTS_LIST = `${BACKEND_API}api/charts/`;
export const DELETE_CHART = (id: any) => `${BACKEND_API}api/charts/${id}/`;
export const PROJECT_CHARTS = (id: any) => `${BACKEND_API}api/projects/${id}/charts/`;
export const SHARED_CHART = `${BACKEND_API}api/shared-charts/`;
// Teams
export const TEAMS = `${BACKEND_API}api/teams/`;
export const PROJECT_TEAMS = `${BACKEND_API}api/projects/teams/`;
export const INVITE_USER = (project_id: any) => `${BACKEND_API}api/projects/${project_id}/invite/`;

// Delete and update user
export const UPDATE_USER = (project_id: any, id: any) =>
  `${BACKEND_API}api/projects/${project_id}/members/${id}`;
export const DELETE_USER = (project_id: any, id: any) =>
  `${BACKEND_API}api/projects/${project_id}/members/${id}`;

export const TEAM = (id: number) => `${BACKEND_API}api/team/${id}/`;
export const USERS = (id: number) => `${BACKEND_API}api/projects/${id}/members/`;
export const TEAM_MEMBERS = (id: number) => `${BACKEND_API}api/team/${id}/members/`;
export const PROJECT_TEAM = (id: number) => `${BACKEND_API}api/project/team/${id}/`;
export const PROJECT_DASHBOARDS = (id: any) => `${BACKEND_API}api/projects/${id}/dashboards/`;
export const Dashboard_LIST = (id: any) => `${BACKEND_API}api/projects/${id}/dashboards/`;
export const CREATE_DASHBOARD = (projectId: any) =>
  `${BACKEND_API}api/projects/${projectId}/dashboards/`;
export const VERIFY_USER = `${BACKEND_API}api/verify/email/`;
export const DASHBOARDS = `${BACKEND_API}api/dashboards/`;
export const updateDashboard = `${BACKEND_API}api/dashboards/`;
export const SHARED_DASHBOARD = `${BACKEND_API}api/shared-dashboards/`;

export const NEW_SHARED_DASHBOARD = `${BACKEND_API}api/send-dashboard-emails/`;

export const NEW_SHARED_CHARTS = `${BACKEND_API}api/send-chart-emails/`;

// ML

//Jupiter
export const LIST_NOTEBOOKS = (project_id:any)=>`${process.env.NOTEBOOK_URL}/projects/${project_id}/notebooks/`;
export const CREATE_NOTEBOOK = `${process.env.NOTEBOOK_URL}/new/notebook/`;

// Regression
export const REGRESSION_LR = `${BACKEND_API}api/linear-regression/`;
export const REGRESSION_SVG = `${BACKEND_API}api/support-vector-regression/`;
export const REGRESSION_DT = `${BACKEND_API}api/decision-tree-regression/`;
export const REGRESSION_RFR = `${BACKEND_API}api/random-forest-regression/`;
export const REGRESSION_XGB = `${BACKEND_API}api/xgb-regression/`;

// Modelling

export const MODELLING_TTS = `${BACKEND_API}api/train-test-split/`;
export const MODELLING_LRM = `${BACKEND_API}api/logistic-regression-model/`;
export const MODELLING_SVC = `${BACKEND_API}api/support-vector-classifier/`;
export const MODELLING_DTC = `${BACKEND_API}api/decision-tree-classifier/`;
export const MODELLING_RFC = `${BACKEND_API}api/random-forest-classifier/`;
export const MODELLING_XGBC = `${BACKEND_API}api/xgb-classifier/`;

// Preporcessing

export const PREPROCESS_DTC = `${BACKEND_API}api/data-type-correction/`;
export const PREPROCESS_ARUC = `${BACKEND_API}api/auto-remove-unwanted-columns/`;
export const PREPROCESS_AI = `${BACKEND_API}api/auto-imputer/`;
export const PREPROCESS_RCC = `${BACKEND_API}api/remove-correlated-columns/`;
export const PREPROCESS_TLE = `${BACKEND_API}api/target-label-encoder/`;
export const PREPROCESS_SS = `${BACKEND_API}api/standard-scale/`;
export const PREPROCESS_MMS = `${BACKEND_API}api/min-max-scale/`;
export const LABEL_ENCODING = `${BACKEND_API}api/label-encoding/`;

export const PREPROCESSING = `${BACKEND_API}api/preprocessingmethods/`;
export const REGRESSION = `${BACKEND_API}api/regressionmethods/`;
export const CLASSIFICATION = `${BACKEND_API}api/modellingmethods/`;
export const TIMESERIES = `${TIME_SERIES_API}api/timeseries/preprocessing/`;

// Loading

export const LOAD_DB = `${BACKEND_API}api/load-db-data/`;
export const LOAD_CSV = `${BACKEND_API}api/load-csv/`;

// Prediction

export const PREDICTION = (modelId: any) => `${BACKEND_API}api/models/${modelId}/prediction/`;
export const TIMESERIES_PREDICTION = (modelId: any) =>
  `${TIME_SERIES_API}api/models/${modelId}/timeseries/prediction/`;

// modals

export const SAVE_MODEL = (projectId: any) => `${BACKEND_API}api/projects/${projectId}/models/`;
export const DELETE_MODEL = (projectId: any, modelId: any) =>
  `${BACKEND_API}api/projects/${projectId}/models/${modelId}/`;
export const GET_MODEL = (projectId: any, modelId: any) =>
  `${BACKEND_API}api/projects/${projectId}/models/${modelId}/`;

export const UPDATE_MODEL = (projectId: any, modelId: any) =>
  `${BACKEND_API}api/projects/${projectId}/models/${modelId}/`;
// triggers

export const TRIGGERS = (projectId: any) => `${BACKEND_API}api/projects/${projectId}/triggers/`;
export const TRIGGERS_OPTIONS = (triggerId: any) =>
  `${BACKEND_API}api/projects/triggers/${triggerId}/`;
export const TRIGGERS_OUTPUT = (triggerId: any) =>
  `${BACKEND_API}api/queries/${triggerId}/triggers/output/`;
