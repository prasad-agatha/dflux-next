import React, { FC } from "react";
// react-bootstrap
import { Form } from "react-bootstrap";

interface IDetailsProps {
  form_data: any;
  handleChange: any;
  values: any;
  error: any;
  valuesSnowFlake?: any;
  activeTab?: any;
}
const Details: FC<IDetailsProps> = (props: IDetailsProps) => {
  const { form_data, handleChange, values, error, valuesSnowFlake } = props;

  return (
    <div className="pb-0">
      <h6 className="mb-0">
        {error?.status ? (
          <div className="d-flex text-danger justify-content-center" style={{ color: "#0DBD49" }}>
            {error.message}
          </div>
        ) : null}
      </h6>
      <Form>
        <div className="container-fluid d-flex ps-2 pe-2">
          <div className="m-1">
            {/* <Form.Label className="input-label-dc-form f-14">Database name</Form.Label> */}

            <Form.Control
              required
              autoComplete="off"
              value={form_data.dbname || values.dbname}
              name="dbname"
              // value={data[0].dbname}
              onChange={handleChange}
              placeholder="Database name"
              className="input-dc-form f-14"
              style={{ width: 335, height: 45 }}
            />
          </div>
          <div className="m-1 ps-5">
            {/* <Form.Label className="input-label-dc-form f-14">Database user</Form.Label> */}

            <Form.Control
              required
              autoComplete="off"
              value={form_data.username || values.username}
              name="username"
              onChange={handleChange}
              placeholder="Database user"
              className="input-dc-form f-14"
              style={{ width: 335, height: 45 }}
            />
          </div>
        </div>
        <div className="container-fluid  d-flex ps-2 pe-2">
          <div className="m-1">
            {/* <Form.Label className="input-label-dc-form f-14">Database password</Form.Label> */}

            <Form.Control
              required
              autoComplete="off"
              value={form_data.password || values.password}
              name="password"
              onChange={handleChange}
              placeholder="Database password"
              className="input-dc-form f-14"
              style={{ width: 335, height: 45 }}
            />
          </div>
          {values.engine === "SNOWFLAKE" || valuesSnowFlake.connection_type === "SNOWFLAKE" ? (
            <div className="m-1 ps-5">
              {/* <Form.Label className="input-label-dc-form f-14">Warehouse</Form.Label> */}

              <Form.Control
                required
                autoComplete="off"
                value={valuesSnowFlake.warehouse}
                name="warehouse"
                onChange={handleChange}
                placeholder="Warehouse"
                className="input-dc-form f-14"
                style={{ width: 335, height: 45 }}
              />
            </div>
          ) : (
            <div className="m-1 ps-5">
              {/* <Form.Label className="input-label-dc-form f-14">Database host</Form.Label> */}

              <Form.Control
                required
                autoComplete="off"
                value={form_data.host || values.host}
                name="host"
                onChange={handleChange}
                placeholder="Database host"
                className="input-dc-form f-14"
                style={{ width: 335, height: 45 }}
              />
            </div>
          )}
        </div>
        {values.engine === "SNOWFLAKE" || valuesSnowFlake.connection_type === "SNOWFLAKE" ? (
          <div className="container-fluid d-flex ps-2 pe-2">
            <div className="m-1">
              {/* <Form.Label className="input-label-dc-form f-14">Schema</Form.Label> */}

              <Form.Control
                required
                autoComplete="off"
                value={valuesSnowFlake.schema}
                name="schema"
                onChange={handleChange}
                placeholder="Schema"
                className="input-dc-form f-14"
                style={{ width: 335, height: 45 }}
              />
            </div>
            <div className="m-1 ps-5">
              {/* <Form.Label className="input-label-dc-form f-14">Account</Form.Label> */}

              <Form.Control
                required
                autoComplete="off"
                value={valuesSnowFlake.account}
                name="account"
                onChange={handleChange}
                placeholder="Account"
                className="input-dc-form f-14"
                style={{ width: 335, height: 45 }}
              />
            </div>
          </div>
        ) : (
          <div className="container-fluid d-flex ps-2 pe-2">
            <div className="m-1">
              {/* <Form.Label className="input-label-dc-form f-14">Database port</Form.Label> */}

              <Form.Control
                required
                autoComplete="off"
                value={form_data.port || values.port}
                name="port"
                onChange={handleChange}
                placeholder="Database port"
                className="input-dc-form f-14"
                style={{ width: 335, height: 45 }}
              />
            </div>
            <div className="m-1 ps-5">
              {/* <Form.Label className="input-label-dc-form f-14">Database display name</Form.Label> */}

              <Form.Control
                autoComplete="off"
                required
                value={form_data.name || values.name}
                name="name"
                onChange={handleChange}
                placeholder="Database display name"
                className="input-dc-form f-14"
                style={{ width: 335, height: 45 }}
              />
            </div>
          </div>
        )}
        {values.engine === "SNOWFLAKE" || valuesSnowFlake.connection_type === "SNOWFLAKE" ? (
          <div className="container-fluid d-flex ps-2 pe-2">
            <div className="m-1">
              {/* <Form.Label className="input-label-dc-form f-14">Data source display name</Form.Label> */}

              <Form.Control
                autoComplete="off"
                required
                value={valuesSnowFlake.name}
                name="name"
                onChange={handleChange}
                placeholder="Data source display name"
                className="input-dc-form f-14"
                style={{ width: 335, height: 45 }}
              />
            </div>
          </div>
        ) : null}
      </Form>
    </div>
  );
};
export default Details;
