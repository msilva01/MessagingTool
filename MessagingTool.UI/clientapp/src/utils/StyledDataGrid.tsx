import { DataGrid } from "@mui/x-data-grid";
import { Theme, styled } from "@mui/material/styles";

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color: "rgba(0,0,0,.85)",
  fontFamily: [
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    "-apple-system",
    "BlinkMacSystemFont",
  ].join(","),
  WebkitFontSmoothing: "auto",
  letterSpacing: "normal",
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: "#fafafa",
  },
  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
    borderRight: `1px solid ${"#f0f0f0"}`,
  },
  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: `1px solid ${"#f0f0f0"}`,
  },
  "& .MuiDataGrid-cell": {
    color: "rgba(0,0,0,.85)",
    maxHeight: "300px !important",
    whiteSpace: "normal !important",
  },
  "& .MuiPaginationItem-root": {
    borderRadius: 0,
  },
  "& .MuiDataGrid-row": {
    maxHeight: "300px !important",
    whiteSpace: "normal !important",
    backgroundColor: "#fff",
  },
  "& .MuiDataGrid-row:hover, .MuiDataGrid-cell:hover": {
    backgroundColor: "#B9BCAF !important",
  },
  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: "#B9BCAF",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#E0DAD1",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#2e2e2e",
    fontWeight: "700",
  },

  ...customCheckbox(theme),
}));

function customCheckbox(theme: Theme) {
  return {
    "& .MuiCheckbox-root svg": {
      width: 16,
      height: 16,
      backgroundColor: "#transparent",
      border: `1px solid ${"#999"}`,
      borderRadius: 2,
    },
    "& .MuiCheckbox-root svg path": {
      display: "none",
    },
    "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
      backgroundColor: "#555", //changed from #1890ff
      borderColor: "#555", //changed from #1890ff
    },
    "& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after": {
      position: "absolute",
      display: "table",
      border: "2px solid #fff",
      borderTop: 0,
      borderLeft: 0,
      transform: "rotate(45deg) translate(-50%,-50%)",
      opacity: 1,
      transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
      content: '""',
      top: "50%",
      left: "39%",
      width: 5.71428571,
      height: 9.14285714,
    },
    "& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after":
      {
        width: 8,
        height: 8,
        backgroundColor: "#555", //changed from #1890ff
        transform: "none",
        top: "39%",
        border: 0,
      },
  };
}
