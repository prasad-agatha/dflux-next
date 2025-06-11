// react
import React, { FC } from "react";

// next router
import { useRouter } from "next/router";
// next seo
import { NextSeo } from "next-seo";

// import Link from "next/link";

// react chart js
import "chartjs-plugin-datalabels";

// react-toastify
import { toast } from "react-toastify";
// icons
import { PageLoading } from "components/loaders";

import { QueryResults } from "components/data-tables";
import { tableStyles } from "constants/common";
// services
import { QueryService, MLService, ModelService } from "services";
import Button from "react-bootstrap-button-loader";
import { PageLoader } from "components/loaders";
//toast configuration
toast.configure();

const mlService = new MLService();
const queryService = new QueryService();
const models = new ModelService();

const PredictionModelling: FC = () => {
  const router = useRouter();
  const { query_id, model_id, project_id } = router.query;

  if (!query_id) {
    return (
      <main className="w-75 h-50 position-fixed">
        <NextSeo title={`${process.env.CLIENT_NAME} - Loading`} description="Loading" />
        <PageLoading />
      </main>
    );
  }
  const [loading, setLoading] = React.useState(true);

  const [queryDetails, setQueryDetails] = React.useState({
    name: "",
    data: [] as any,
    list: [] as any,
    mlData: [] as any,
  });

  React.useEffect(() => {
    if (query_id) {
      getModelInfo(model_id);
    }
  }, [query_id, project_id, model_id]);
  // get model data by model_id
  const getModelInfo = (id: any) => {
    models
      .getModel(project_id, id)
      .then((res) => {
        if (res.extra.modelling === "Timeseries") {
          queryService
            .getQueryDetails(query_id)
            .then((response: any) => {
              setLoading(false);

              const list: any = [];
              const arr =
                response.extra.data?.length > 0 ? Object.keys(response.extra.data[0]) : null;
              arr?.map((item) => {
                return list.push({
                  field: item,
                });
              });

              setQueryDetails({
                ...queryDetails,
                name: response.name,
                data: response.extra.data,
                list: list,
              });

              getTimeSeriesPrediction(model_id, response.extra.data, response.name, list);
            })
            .catch((error: any) => {
              toast.error(error.detail);
              toast.error(error);
            });
        } else {
          queryService
            .getQueryDetails(query_id)
            .then((response: any) => {
              setLoading(false);

              const list: any = [];
              const arr =
                response.extra.data?.length > 0 ? Object.keys(response.extra.data[0]) : null;
              arr?.map((item) => {
                return list.push({
                  field: item,
                });
              });

              setQueryDetails({
                ...queryDetails,
                name: response.name,
                data: response.extra.data,
                list: list,
              });

              getPrediction(model_id, response.extra.data, response.name, list);
            })
            .catch((error: any) => {
              toast.error(error.detail);
              toast.error(error);
            });
        }
      })
      .catch();
  };
  // get prediction data for classification and regression
  const getPrediction = (model_id: any, data: any, name: any, list: any) => {
    mlService
      .prediction(model_id, {
        input_array: data,
      })
      .then((response: any) => {
        // setPrediction(response.prediction);
        setQueryDetails({
          ...queryDetails,
          name: name,
          data: data.map((ele: any, index: any) => {
            return {
              ...ele,
              prediction: (response.prediction && response.prediction[index]) || "" || 0,
            };
          }),
          list: [...list, { field: "prediction" }],
        });

        // models.updateModel(project_id, model_id, {
        //   data: queryDetails.data,
        // });
      })
      .catch((error: any) => {
        toast.error(error.error);
      });
  };
  // get prediction data for time series
  const getTimeSeriesPrediction = (model_id: any, data: any, name: any, list: any) => {
    mlService
      .timeSeriesPrediction(model_id, {
        data: data,
      })
      .then((response: any) => {
        // setPrediction(response.prediction);
        setQueryDetails({
          ...queryDetails,
          name: name,
          data: data.map((ele: any, index: any) => {
            return {
              ...ele,
              prediction: (response.prediction && response.prediction[index]) || "",
            };
          }),

          list: [...list, { field: "prediction" }],
        });

        // models.updateModel(project_id, model_id, {
        //   data: queryDetails.data,
        // });
      })
      .catch((error: any) => {
        toast.error(error.error);
      });
  };

  const createVisualization = () => {
    models
      .updateModel(project_id, model_id, {
        data: queryDetails.data,
      })
      .then(() => {
        router.push(`/projects/${project_id}/visualization/model/${model_id}`);
      });
  };
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Prediction Model`} description="Prediction" />

      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="d-flex  px-5 justify-content-between">
            <div className="d-flex summary-1 mt-4">
              <h4 className="mb-2 title">Prediction Model</h4>
            </div>

            <div className="ms-auto mt-4">
              {/* <Link href={`/projects/${project_id}/visualization/model/${model_id}`}> */}
              <Button
                type="submit"
                onClick={createVisualization}
                className="mt-0 mb-2 f-16 text-white"
              >
                Create visualization
              </Button>
              {/* </Link> */}
            </div>
          </div>
          <div className="px-5 mt-4" style={{ overflowY: "scroll", borderTop: "3px solid white" }}>
            <QueryResults
              row={10}
              list={queryDetails.list}
              query={queryDetails.data}
              chart={tableStyles}
            />
          </div>
        </>
      )}
    </>
  );
};
export default PredictionModelling;
