import { DATA_PER_PAGE } from "@/utils/constants";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

interface DatatableProps {
  totalCount: number;
  paginationModel: GridPaginationModel;
  handlePaginationModelChange: (model: GridPaginationModel) => void;
  loading: boolean;
  rows: any[];
  columns: any;
}

const Datatable: React.FC<DatatableProps> = ({
  totalCount,
  paginationModel,
  handlePaginationModelChange,
  loading,
  rows,
  columns,
}) => {
  return (
    <DataGrid
      sx={{
        "& .MuiDataGrid-root": {
          padding: 0,
        },
        "& .MuiDataGrid-main": {
          padding: 0,
        },
        "& .MuiDataGrid-virtualScroller": {
          margin: 0,
          padding: 0,
        },
        "& .MuiDataGrid-row": {
          minHeight: "70px !important",
          height: "70px !important",
          maxHeight: "70px !important",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiDataGrid-cell": {
          padding: "0 8px !important",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        },
        "& .MuiDataGrid-cellContent": {
          whiteSpace: "normal",
          wordWrap: "break-word",
          textAlign: "center",
          width: "100%",
        },
      }}
      rowHeight={70}
      getEstimatedRowHeight={() => 200}
      paginationMode="server"
      rowCount={totalCount}
      paginationModel={paginationModel}
      pageSizeOptions={[DATA_PER_PAGE]}
      onPaginationModelChange={handlePaginationModelChange}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      disableColumnMenu
      disableRowSelectionOnClick
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      disableVirtualization
      getRowId={(row) => row.id}
      loading={loading}
      rows={rows}
      columns={columns}
    />
  );
};

export default Datatable;
