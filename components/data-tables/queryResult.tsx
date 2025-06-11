import React, { FC } from "react";
import { Image } from "react-bootstrap";
// react-data-table
import DataTable, { createTheme } from "react-data-table-component";
// components
import { PageLoading } from "components/loaders";
interface IQueryResultsProps {
  list: any;
  query: any;
  row?: any;
  style?: any;
}

const Results: FC<IQueryResultsProps> = (props) => {
  const { list, query, row, style } = props;
  // array of objects
  const head: any = [];
  list.map((item: any) => {
    const obj = {
      name: (
        <div className="d-flex">
          {item.type === "number" && <Image src="/charts/123Icon.svg" className="me-2" />}
          {item.type === "string" && <Image src="/charts/abcIcon.svg" className="me-2" />}
          <p className="mb-0 ms-1 py-2">{item.field}</p>
        </div>
      ),
      sortable: true,
      center: style ? false : true,
      selector: `${item.field}`,
      style: {cursor: 'auto'}
      // cell: (row: any) => <h6>{row[item.field]}</h6>,
    };
    head.push(obj);
  });
  const customStyles = {
    headRow: {
      style: {
        minHeight: "25px",
        fontFamily: "Inter",
        fontSize: "13px",
        backgroundColor: "#E5E8EC",
        border: "0.5px solid #DBDDE0",
      },
    },
    rows: {
      style: {
        minHeight: "25px",
        textOverflow: "unset",
        // fontFamily: "Metropolis",
        fontSize: "13px",
        letterSpacing: "0.1px",
        color: "black",
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
        // minWidth: 100,
        // width: 250,
        fontSize: "16px",
        // fontFamily: "Metropolis",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {},
    },
    pagination: {
      style: {
        // color: theme.text.secondary,
        fontSize: "15px",
        minHeight: "45px",
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
      theme="solarized"
      responsive
      customStyles={style ? style : customStyles}
      data={query}
      columns={head}
      noHeader
      defaultSortAsc
      pagination={row ? true : false}
      paginationPerPage={row ? row : 10}
      paginationRowsPerPageOptions={row ? [10, 20, 30, 40, 50] : [10, 15, 20]}
      paginationComponentOptions={{
        rowsPerPageText: row ? "Previewing" : "Rows per page:",
        rangeSeparatorText: "of",
        noRowsPerPage: false,
        selectAllRowsItem: row ? true : false,
        selectAllRowsItemText: "All",
      }}
      fixedHeader={true}
      highlightOnHover
      pointerOnHover
      overflowY
      striped={true}
      // selectableRows
      persistTableHead
      // progressPending={progress}
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
export default Results;
