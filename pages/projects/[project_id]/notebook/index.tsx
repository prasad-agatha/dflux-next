// react
import React, { FC } from "react";
// next router
import { useRouter } from "next/router";
// next seo
import { NextSeo } from "next-seo";
// toast
import { toast } from "react-toastify";
// components
import { Notebooks } from "components/tabs";
import { NotebookService, ProjectsService } from "services";
const notebookService = new NotebookService();



//toast configuration
toast.configure();
const projectsAPI = new ProjectsService();

const NotebookPage: FC = () => {
  const router = useRouter();
  const { project_id } = router.query;
  const [notebookData, setNoteBookData] = React.useState<any>(null);

  React.useEffect(() => {
    if (project_id)
    getNotebooks();
  }, [project_id]);

  

  const getNotebooks = async () => {
    const projectData = await projectsAPI.getProjectData(project_id);
    if (projectData?.token) {
      notebookService
        .getNotebooks(projectData?.token)
        .then((data) => setNoteBookData(data.notebooks || []))
        .catch((error: any) => {
          toast.error(error);
        });
    }
  };

  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Notebook`} description="Notebook-Jupyter" />

      <div className=" d-flex flex-column">
        <div className="d-flex align-items-center flex-row pt-2">
          <Notebooks notebookData={notebookData} notebookMutate={""} />
        </div>
      </div>
    </>
  );
};

export default NotebookPage;
