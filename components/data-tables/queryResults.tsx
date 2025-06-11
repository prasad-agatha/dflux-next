import React, { FC } from "react";
// react-data-table
import DataTable, { createTheme } from "react-data-table-component";
// components
import { PageLoading } from "components/loaders";
import { getLabel } from "@constants/common";

interface IQueryResultsProps {
  list: any;
  query: any;
  row?: any;
  style?: any;
  chart?: any;
}

const QueryResults: FC<IQueryResultsProps> = (props) => {
  const { list, query, row, style, chart } = props;
  // array of objects
  chart.cells.style.cursor = "text";
  const head: any = [];
  list.map((item: any) => {
    const obj = {
      name: getLabel(`${item.field}`),
      sortable: true,
      center: style ? false : true,
      selector: `${item.field}`,
      // cell: (row: any) => <h6>{row[item.field]}</h6>,
    };
    head.push(obj);
  });

  createTheme("solarized", {
    text: {
      primary: "#495968",
      secondary: "#0076FF",
    },
    background: {
      default: "#FFFFFF",
    },
    rows: {
      highlightOnHoverStyle: {
        color: "#FFFFFF",
        backgroundColor: "#0076FF",
        transitionDuration: "0.15s",
        transitionProperty: "background-color",
        // borderBottomColor: theme.background.default,
        outlineStyle: "solid",
        outlineWidth: "1px",
        // outlineColor: theme.background.default,
      },
    },

    context: {
      background: "#cb4b16",
      text: "#FFFFFF",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
  });

  return (
    <DataTable
      // theme="solarized"
      responsive
      customStyles={chart ? chart : {}}
      // customStyles={table}
      // customStyles={style ? style : customStyles}
      data={query}
      columns={head}
      noHeader
      defaultSortAsc
      pagination={row ? true : false}
      paginationPerPage={row ? row : 10}
      paginationRowsPerPageOptions={row ? [5, 10] : [5, 10, 15, 20]}
      paginationComponentOptions={{
        rowsPerPageText: row ? "Previewing" : "Rows per page:",
        rangeSeparatorText: "of",
        noRowsPerPage: false,
        selectAllRowsItem: row ? true : false,
        selectAllRowsItemText: "All",
      }}
      highlightOnHover
      pointerOnHover
      striped
      // selectableRows
      // overflowY
      persistTableHead
      // progressPending={progress}
      progressComponent={<PageLoading />}
      style={{
        paddingTop: 0,
        paddingRight: 10,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
      }}
    />
  );
};
export default QueryResults;
