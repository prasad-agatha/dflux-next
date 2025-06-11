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
    },
  },
  headRow: {
    style: {
      minHeight: "50px",
      fontFamily: "Inter",
      fontSize: 14,
      fontStyle: "normal",
      letterSpacing: 0.01,
      color: "#495968",
      opacity: 0.6,
      backgroundColor: "#F6F9FB",
      // border: "1px solid #E4E4E4",
      borderSizing: "border-box",
    },
  },
  rows: {
    style: {
      borderBottom: "0px",
      minHeight: "60px",
      height: "60px",
      // overflow: "hidden",
      // overflowY: "hidden",
      // fontFamily: "Metropolis",
      // fontSize: 15,
      // fontStyle: "normal",
      // letterSpacing: 0.1,
      // color: "#707683",
    },
    highlightOnHoverStyle: {
      color: "#495968",
      backgroundColor: "rgba(0, 118, 255, 0.05)",
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
      // fontFamily: "Inter",
      // fontSize: 14,
      // fontStyle: "normal",
      // letterSpacing: 0.01,
      // color: "#495968",
      // opacity: 0.6,
      // fontWeight: "bold",
    },
  },
  cells: {
    style: {},
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
      // fontFamily: "Metropolis",
      fontStyle: "normal", // borderTopColor: theme.divider.default,
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      padding: "10px",
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
interface IListTableProps {
  columns: any;
  data: any;
  progress?: any;
}

const ListTable: FC<IListTableProps> = (props) => {
  const { columns, data, progress } = props;
  // const tableData = { columns, data, export: false, print: false, filterPlaceholder: "Search" };
  return (
    <DataTable
      theme="solarized"
      responsive
      customStyles={customStyles}
      data={data}
      columns={columns}
      noHeader
      defaultSortAsc
      pagination
      paginationComponentOptions={{
        rowsPerPageText: "Rows per page:",
        rangeSeparatorText: "of",
        noRowsPerPage: false,
        selectAllRowsItem: false,
        selectAllRowsItemText: "All",
      }}
      fixedHeader={true}
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
  );
};

export default ListTable;
