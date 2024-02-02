import { Box, Container, Paper, Stack, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledDataGrid } from "../../utils/StyledDataGrid";
import {
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  DataGridPropsWithDefaultValues,
  DataGridPropsWithoutDefaultValue,
} from "@mui/x-data-grid/internals";
import { Button } from "@mui/material";
import {
  GridColDef,
  GridFooterContainer,
  GridPagination,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
  GridRowSelectionModel,
  GridSortDirection,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { DataGridForcedPropsKey } from "@mui/x-data-grid/models/props/DataGridProps";
import { useQuery } from "@tanstack/react-query";
import { GetAsync } from "../../utils/apiDataWorker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  faCircle,
  faCircleCheck,
  faPenSquare,
  faSms,
  faSquare,
  faSquareCheck,
  faSquareFull,
  faSquareH,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { NotificationModal } from "../../utils/NotificationModal";
import { MessageEdit } from "./MessageEdit";

interface ISendMessageProps {}
export interface PhoneNumberWrapper {
  totalNumberOfResults: number;
  totalNumberOfRecords: number;
  pageNumber: number;
  rowsPerPage: number;
  items: PhoneNumbersDto[];
}

export interface PhoneNumbersDto {
  id: number;
  phoneNumber: string;
  messageSentOn?: string;
  doNotCall: boolean;
  active: boolean;
}
interface PagedQueryData {
  sortBy?: string;
  sortOrder?: GridSortDirection;
  pageNumber: number;
  rowsPerPage: number;
  field?: string;
  filterOperator?: string;
  value?: string;
  queryKey?: string;
}
interface messageModalType {
  id: "donotcall" | "sendsms" | "sendall" | "none";
}

export function SendMessage(props: ISendMessageProps) {
  const [showModal, setShowModal] = useState<messageModalType>({ id: "none" });

  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);
  const [searchData, setSearchData] = useState<PagedQueryData>({
    pageNumber: 0,
    rowsPerPage: 10,
    sortOrder: "asc",
    queryKey: "",
  });

  useEffect(() => {
    console.log(selectedIds);
  }, [selectedIds]);
  const columns: GridColDef[] = [
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.6,
      sortable: false,
      filterable: false,
    },
    {
      field: "messageSentOn",
      headerName: "Last Message Sent On",
      flex: 0.6,
      sortable: false,
      filterable: false,
    },
  ];
  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setSearchData({
      ...searchData,
      pageNumber: newPaginationModel.page,
      rowsPerPage: newPaginationModel.pageSize,
    });
  };
  const { data: gridData } = useQuery<PhoneNumberWrapper>({
    queryKey: [
      "PhoneNumberGrid",
      searchData.pageNumber,
      searchData.rowsPerPage,
    ],
    queryFn: async () =>
      await GetAsync<PhoneNumberWrapper>(
        `/Home/Get?rowsPerPage=${searchData.rowsPerPage}&pageNumber=${searchData.pageNumber}`
      ).then((res) => res.data),
  });

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <div style={{ width: "100%" }}>
          <div className="float-start">
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={selectedIds.length == 0}
              onClick={() => setShowModal({ id: "sendsms" })}
              className="me-4 mb-2"
            >
              <FontAwesomeIcon icon={faSms}></FontAwesomeIcon>
              &nbsp;Send Message
            </Button>

            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={selectedIds.length == 0}
              onClick={() => setShowModal({ id: "donotcall" })}
              className="me-4 mb-2"
            >
              <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>
              &nbsp;Do Not Call
            </Button>

            <Button
              variant="contained"
              color="warning"
              type="submit"
              className="me-4 mb-2"
            >
              <FontAwesomeIcon icon={faTriangleExclamation}></FontAwesomeIcon>
              &nbsp;Send Message to all {gridData?.totalNumberOfRecords} numbers
            </Button>
          </div>
          <div className="float-end">
            <GridToolbarQuickFilter />
          </div>
        </div>
      </GridToolbarContainer>
    );
  };

  //style in element p will make the gridfooter messed up !!!
  // index.css changed .MuiToolbar-root  > p to fix this

  return (
    <>
      <Container maxWidth="lg" className=" p-3 mt-1">
        <MessageEdit
          show={showModal.id === "sendsms"}
          onHide={() => setShowModal({ id: "none" })}
          ids={selectedIds}
        />
        <NotificationModal
          show={showModal.id === "donotcall"}
          headerTitle="Do Not Call"
          bodyMessage="Are you sure you want to set the selected numbers as DO NOT CALL ? \n\n          
        Click Yes to delete or No
            to cancel and return to the previous screen."
          onHide={() => setShowModal({ id: "none" })}
          updateData={() => {
            console.log("here");
          }}
          headerColor="delete"
        />
        <Paper
          elevation={8}
          className="mt-2 p-4"
          style={{ backgroundColor: "#F6F3EE" }}
        >
          <h2 className="mb-4">Send Text </h2>
          <StyledDataGrid
            checkboxSelection
            columns={columns}
            paginationMode="server"
            editMode="row"
            autoHeight
            pageSizeOptions={[5, 10, 25]}
            rows={gridData?.items || []}
            rowCount={gridData?.totalNumberOfRecords}
            filterDebounceMs={300}
            onPaginationModelChange={handlePaginationModelChange}
            onRowSelectionModelChange={(ids: GridRowSelectionModel) => {
              setSelectedIds(ids);
            }}
            rowSelectionModel={selectedIds}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            slots={{
              noRowsOverlay: () => (
                <Stack direction="row" justifyContent="center">
                  <h4 className="mt-2">No Records Found</h4>
                </Stack>
              ),
              toolbar: CustomToolbar,
              footer: GridPagination,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Paper>
      </Container>
    </>
  );
}
