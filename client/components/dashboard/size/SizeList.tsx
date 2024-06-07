"use client";
import React, { useRef, useState } from "react";
import {
  FormOutlined,
  RestOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { ActionType } from "../../../constants/constants";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Tag, Popconfirm, Empty, Image, Input, Spin } from "antd";
import { toast } from "react-toastify";
import { deleteSize } from "@/lib/apis/size";

const SizeList = ({ sizes, setAction }: any) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState({});
  // console.log("🚀 ~ sizes siat:", sizes);
  // query
  const dt = useRef(null);

  const handleDelete = async (id: string) => {
    setTimeout(async () => {
      setLoading({ ...loading, [`delete_${id}`]: true });
      const result = await deleteSize(id);
      setLoading({ [`delete_${id}`]: false });
      if (result.error) toast.error(result.error.data.message);
      setAction({});
      toast.success("Brand deleted successfully");
    }, 300);
  };

  // jsx funcitons
  const bodyTemplate = ({ rowData, field }: any) => {
    const { status } = rowData;

    switch (field) {
      case "status":
        return (
          <Tag color={status ? "green" : "red"}>
            {status ? "Active" : "Inactive"}
          </Tag>
        );

      case "action":
        return (
          <div>
            <Button
              size="small"
              icon={<FormOutlined />}
              title="Edit"
              className="me-1"
              onClick={() =>
                setAction({
                  type: ActionType.UPDATE,
                  payload: { ...rowData, fileName: rowData.logo },
                })
              }
            />
            <Popconfirm
              title={
                <span>
                  Are you sure{" "}
                  <span className="text-danger fw-bold">delete</span> this
                  Brand?
                </span>
              }
              onConfirm={() => handleDelete(rowData.id)}
              placement="left"
              okText="Yes"
              okType="danger"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button
                size="small"
                danger
                // loading={loading[`delete_${rowData.id}`]}
                icon={<RestOutlined />}
              />
            </Popconfirm>
          </div>
        );
      default:
        return null;
    }
  };

  // rendering
  return (
    <main>
      <div className="flex items-center justify-between p-3">
        <div className="text-start">
          <Button disabled size="small" icon={<PrinterOutlined />}></Button>
          <Button
            size="small"
            className="mx-1"
            title="Export Csv"
            // onClick={() => exportCSV(false)}
            // loading={loading.exportCsv}
            icon={<FileExcelOutlined />}
          />
          <Button
            disabled
            size="small"
            className="me-5"
            title="Export Pdf"
            icon={<FilePdfOutlined />}
          />
        </div>
        <div className="text-end">
          <Input
            className="focus:border-1 p-1"
            onChange={({ target }: any) => setGlobalFilter(target.value)}
            placeholder="Search...."
          />
        </div>
      </div>
      <DataTable
        value={sizes || []}
        paginator={true}
        rows={20}
        rowsPerPageOptions={[20, 50, 100, 200]}
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rowHover
        dataKey="id"
        showGridlines
        resizableColumns={true}
        columnResizeMode="expand"
        globalFilter={globalFilter}
        emptyMessage={
          <div className="text-center">
            {false ? ( // loading
              <div className="w-full text-center">
                <Spin className="inline-block" />
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        }
        // header={header}
        ref={dt}
        className="p-datatable-sm rounded-md border text-center"
      >
        <Column className="border" field="name" header="Name" />
        <Column
          field="status"
          style={{ width: "100px" }}
          className="border"
          header="Status"
          body={(rowData, { rowIndex, field }) =>
            bodyTemplate({ rowData, rowIndex, field: "status" })
          }
        />
        <Column
          header="Option"
          className="border text-center"
          style={{ width: "10px" }}
          body={(rowData, { rowIndex, field }) =>
            bodyTemplate({ rowData, rowIndex, field: "action" })
          }
        />
      </DataTable>
    </main>
  );
};

export default SizeList;
