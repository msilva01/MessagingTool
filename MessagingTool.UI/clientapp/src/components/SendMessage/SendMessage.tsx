import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import { StyledDataGrid } from "../../utils/StyledDataGrid";
import { Button } from "@mui/material";
import {
  GridColDef,
  GridFilterModel,
  GridFooterContainer,
  GridPagination,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
  GridSortDirection,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAsync, PostAsync } from "../../utils/apiDataWorker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCircleXmark,
  faEraser,
  faSearch,
  faSms,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { NotificationModal } from "../../utils/NotificationModal";
import { MessageEdit } from "./MessageEdit";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";

interface ISendMessageProps {
  doNotCall: boolean;
}
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
}
interface PagedQueryData {
  sortBy?: string;
  sortOrder?: GridSortDirection;
  pageNumber: number;
  rowsPerPage: number;
  field?: string;
  value?: string;
  queryKey?: string;
}
interface messageModalType {
  id: "donotcall" | "sendsms" | "sendall" | "none";
}

interface DoNotCallCommand {
  phoneNumberIds: string[];
  doNotCall: boolean;
}

export function SendMessage({ doNotCall = false }: ISendMessageProps) {
  const [filterValue, setFilterValue] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [showModal, setShowModal] = useState<messageModalType>({ id: "none" });
  const [language, setLanguage] = useState("1");
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);
  const [searchData, setSearchData] = useState<PagedQueryData>({
    pageNumber: 0,
    rowsPerPage: 10,
    sortOrder: "asc",
    queryKey: "",
  });
  const queryClient = useQueryClient();
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
      language,
      doNotCall,
      searchData.field,
      searchData.value,
    ],
    queryFn: async () =>
      await GetAsync<PhoneNumberWrapper>(
        `/Home/Get?rowsPerPage=${searchData.rowsPerPage}&pageNumber=${searchData.pageNumber}&language=${language}&doNotCall=${doNotCall}&field=${searchData.field}&value=${searchData.value}`
      ).then((res) => res.data),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: DoNotCallCommand) =>
      await PostAsync("Home/UpdateDoNotCall", data),
    onSuccess: (res: any) => {
      toast.success(`Selected Records were moved`);
      setShowModal({ id: "none" });
      queryClient.resetQueries({ queryKey: ["PhoneNumberGrid"], exact: false });
    },
    onError: (err: any) => {
      toast.error(err.response?.data.message || err);
    },
  });

  const onChangeHandler = (ev: SelectChangeEvent) => {
    setLanguage(ev.target.value as string);
  };

  const CustomFooter = () => {
    return (
      <GridFooterContainer>
        <div style={{ width: "100%" }}>
          <div className="float-end" style={{ textAlign: "right" }}>
            <GridPagination />
          </div>
        </div>
      </GridFooterContainer>
    );
  };
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <div style={{ width: "100%" }}>
          <div className="float-start">
            {doNotCall && (
              <div className="float-start mb-3 mt-2">
                <Button
                  variant="contained"
                  color="error"
                  type="button"
                  className="me-4"
                  disabled={selectedIds.length == 0}
                  onClick={() => setShowModal({ id: "donotcall" })}
                >
                  <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
                  &nbsp;Remove Do Not Call
                </Button>
              </div>
            )}
            {!doNotCall && (
              <div className="float-start mb-3 mt-2">
                <Button
                  variant="contained"
                  color="error"
                  type="button"
                  className="me-4"
                  disabled={selectedIds.length == 0}
                  onClick={() => setShowModal({ id: "donotcall" })}
                >
                  <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>
                  &nbsp;Do Not Call
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  type="button"
                  disabled={selectedIds.length == 0}
                  onClick={() => {
                    setSendToAll(false);
                    setShowModal({ id: "sendsms" });
                  }}
                  className="me-4"
                >
                  <FontAwesomeIcon icon={faSms}></FontAwesomeIcon>
                  &nbsp;Send Message
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  type="button"
                  className="me-4"
                  onClick={() => {
                    setSendToAll(true);
                    setShowModal({ id: "sendsms" });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                  ></FontAwesomeIcon>
                  &nbsp;Send Message to all {gridData?.totalNumberOfRecords}
                  &nbsp; numbers
                </Button>
              </div>
            )}
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
          sendToAll={sendToAll}
          language={language}
          show={showModal.id === "sendsms"}
          totalCount={gridData?.totalNumberOfRecords}
          onHide={() => setShowModal({ id: "none" })}
          ids={selectedIds}
        />
        <NotificationModal
          show={showModal.id === "donotcall"}
          headerTitle="Do Not Call"
          bodyMessage={
            doNotCall
              ? "Are you sure you want to set the assigned numbers as ABLE TO RECEIVE A MESSAGE? Click Yes to confirm or No to cancel."
              : "Are you sure you want to set the selected numbers as DO NOT CALL ? Click Yes to confirm or No to cancel."
          }
          onHide={() => setShowModal({ id: "none" })}
          updateData={() => {
            mutate({
              doNotCall: !doNotCall,
              phoneNumberIds: selectedIds.map((x) => x.toString()),
            });
          }}
          headerColor="delete"
        />
        <Paper
          elevation={8}
          className="mt-2 p-4"
          style={{ backgroundColor: "#F6F3EE" }}
        >
          <div>
            <Stack direction="row">
              <h2 className="me-4">
                {doNotCall ? "Do Not Call List" : "Send Text "}
              </h2>
              {!doNotCall && (
                <FormControl style={{ width: 200 }} className="ms-4">
                  <InputLabel id="demo-simple-select-label">
                    language
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Language"
                    onChange={onChangeHandler}
                    value={language}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="1"> English </MenuItem>
                    <MenuItem value="2"> Spanish </MenuItem>
                  </Select>
                </FormControl>
              )}
              <FormControl className="mt-0 ms-2">
                <TextField
                  id="search"
                  type="text"
                  label="Search Phone Number"
                  variant="outlined"
                  margin="none"
                  onChange={(e) => setFilterValue(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      queryClient.resetQueries({
                        queryKey: ["PhoneNumberGrid"],
                        exact: false,
                      });
                      setSearchData({
                        ...searchData,
                        field: "phoneNumber",
                        value: filterValue,
                      });
                    }
                  }}
                  value={filterValue}
                  InputLabelProps={{
                    required: true,
                  }}
                  fullWidth
                />
              </FormControl>
              <Button
                variant="contained"
                color="success"
                size="medium"
                type="button"
                className="ms-2"
                onClick={() => {
                  queryClient.resetQueries({
                    queryKey: ["PhoneNumberGrid"],
                    exact: false,
                  });
                  setSearchData({
                    ...searchData,
                    field: "phoneNumber",
                    value: filterValue,
                  });
                }}
              >
                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>&nbsp; Search
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                type="button"
                className="ms-2"
                onClick={() => {
                  setFilterValue("");
                  setSearchData({
                    ...searchData,
                    field: "",
                    value: "",
                  });
                }}
              >
                <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>&nbsp;
                Clear Search
              </Button>
            </Stack>
          </div>
          <StyledDataGrid
            checkboxSelection
            columns={columns}
            paginationMode="server"
            editMode="row"
            autoHeight
            pageSizeOptions={[5, 10, 25]}
            rows={gridData?.items || []}
            rowCount={gridData?.totalNumberOfRecords || 0}
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
              footer: CustomFooter,
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
