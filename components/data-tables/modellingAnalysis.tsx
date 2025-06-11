import React, { FC } from "react";
// react-data-table
import DataTable, { createTheme } from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";
// components
import { PageLoading } from "components/loaders";

const customStyles = {
  tableWrapper: {
    style: {
      display: "flex",
      flex: 1,
      // height: "100%",
      // width: "100%",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#E5E8EC",
      border: "0.5px solid #DBDDE0",
      borderSizing: "border-box",
      // textTransform: "capitalize",
      minHeight: "45px",
      height: "50px",
      fontSize: "13px",
      // fontFamily: "Metropolis",
      color: "#3B3E40",
      // textAlign: "center",
    },
  },
  rows: {
    style: {
      borderBottom: "0px",
      minHeight: "45px",
      height: "50px",
      fontFamily: "Inter",
      // borderRight: " 0.695975px solid #C1D2E1",
      fontSize: "13px",
      color: "#3B3E40",
      // textAlign: "end",
    },
    highlightOnHoverStyle: {
      color: "#3B3E40",
      backgroundColor: "#fff",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      // borderBottomColor: theme.background.default,
      outlineStyle: "solid",
      outlineWidth: "1px",
      // outlineColor: theme.background.default,
    },
  },
  headCells: {
    style: {
      fontSize: "16px",
      // fontWeight: "bold",
      // textAlign: "center",
    },
  },
  cells: {
    style: {
      // textAlign: "center",
      // borderRight: " 0.695975px solid #C1D2E1",
    },
  },
  // pagination: {
  //   style: {
  //     fontSize: "15px",
  //   },
  // },
  pagination: {
    style: {
      // color: theme.text.secondary,
      fontSize: "15px",
      minHeight: "56px",
      // backgroundColor: theme.background.default,
      // borderTopStyle: "solid",
      borderTopWidth: "1px",
      // borderTopColor: theme.divider.default,
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      padding: "8px",
      margin: "px",
      cursor: "pointer",
      transition: "0.4s",
      // color: theme.button.default,
      // fill: theme.button.default,
      backgroundColor: "transparent",
      "&:disabled": {
        cursor: "unset",
        // color: theme.button.disabled,
        // fill: theme.button.disabled,
      },
      "&:hover:not(:disabled)": {
        cursor: "pointer",
        // backgroundColor: theme.button.hover,
      },
      "&:focus": {
        outline: "none",
        // backgroundColor: theme.button.focus,
      },
    },
  },
};

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
      backgroundColor: "red",
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
interface IListTableProps {
  columns: any;
  data: any;
  progress?: any;
  row?: any;
}

const ModellingAnalysis: FC<IListTableProps> = (props) => {
  const { columns, data, progress, row } = props;

  return (
    // <DataTableExtensions {...tableData}>
    <DataTable
      subHeaderAlign="center"
      theme="solarized"
      responsive
      customStyles={customStyles}
      data={data}
      columns={columns}
      noHeader
      defaultSortAsc
      pagination={false}
      paginationPerPage={row ? row : 10}
      paginationRowsPerPageOptions={row ? [10] : [10, 15, 20]}
      paginationComponentOptions={{
        rowsPerPageText: row ? "Previewing" : "Rows per page:",
        rangeSeparatorText: "of",
        noRowsPerPage: row ? true : false,
        selectAllRowsItem: row ? true : false,
        selectAllRowsItemText: "All",
      }}
      fixedHeader={false}
      highlightOnHover
      pointerOnHover
      overflowY
      // selectableRows
      persistTableHead
      progressPending={progress}
      progressComponent={<PageLoading />}
      style={{
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
      }}
    />
    // </DataTableExtensions>
  );
};

export default ModellingAnalysis;
