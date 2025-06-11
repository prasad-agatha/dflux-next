import { APIService } from "services";
import { LIST_NOTEBOOKS, CREATE_NOTEBOOK } from "lib/endpoints";

class NotebookService extends APIService {
  createNotebook(data: any): Promise<any> {
    return fetch(CREATE_NOTEBOOK, { method:"POST",body: JSON.stringify(data) })
    .then((res) => res.json())
    .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
  }

  getNotebooks(data: any): Promise<any> {
    return fetch(LIST_NOTEBOOKS(data))
      .then((res) => res.json())
      .then((res) => res)
      .catch((error: any) => {
        throw error;
      });
    
  }
}
export default NotebookService;