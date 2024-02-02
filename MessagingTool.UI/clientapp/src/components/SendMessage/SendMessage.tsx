import { Box, Container, Paper, Stack, Toolbar } from "@mui/material";
import React from "react";
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
  GridRenderCellParams,
  GridRowId,
  GridRowSelectionModel,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { DataGridForcedPropsKey } from "@mui/x-data-grid/models/props/DataGridProps";
import { useQuery } from "@tanstack/react-query";
import { GetAsync } from "../../utils/apiDataWorker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircle,
  faCircleCheck,
  faPenSquare,
  faSquare,
  faSquareCheck,
  faSquareFull,
  faSquareH,
} from "@fortawesome/free-solid-svg-icons";

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
export function SendMessage(props: ISendMessageProps) {
  const columns: GridColDef[] = [
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.6,
    },
    {
      field: "messageSentOn",
      headerName: "Last Message Sent On",
      flex: 0.6,
    },
    {
      field: "doNotCall",
      headerName: "Do Not Call",
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => {
        return (
          params?.row?.doNotCall && <FontAwesomeIcon icon={faCircleCheck} />
        );
      },
    },
  ];

  const { data: gridData } = useQuery<PhoneNumberWrapper>({
    queryKey: ["PhoneNumberGrid"],
    queryFn: async () =>
      await GetAsync<PhoneNumberWrapper>(
        `/Home/Get?rowsPerPage=10&pageNumber=0`
      ).then((res) => res.data),
  });

  return (
    <>
      <Container maxWidth="xl" className=" p-3 mt-5">
        <Paper
          elevation={8}
          className="mt-2 p-4"
          style={{ backgroundColor: "#F6F3EE" }}
        >
          <h2 className="mb-4">Send Text </h2>
          <StyledDataGrid
            checkboxSelection
            columns={columns}
            editMode="row"
            autoHeight
            rows={gridData?.items || []}
            rowCount={gridData?.totalNumberOfRecords}
            filterDebounceMs={300}
            disableRowSelectionOnClick
            slots={{
              noRowsOverlay: () => (
                <Stack direction="row" justifyContent="center">
                  <h4 className="mt-2">No Records Found</h4>
                </Stack>
              ),
              toolbar: GridToolbar,
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
