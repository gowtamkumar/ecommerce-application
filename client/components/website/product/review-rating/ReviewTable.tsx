/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Rate, Row, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import {
  deleteReview,
  getReviews,
  reviewDisLike,
  reviewLike,
} from "@/lib/apis/review";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import {
  FormOutlined,
  RestOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { toast } from "react-toastify";
import { BiDislike, BiLike } from "react-icons/bi";
import Image from "next/image";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface DataType {
  key: string;
  product: any;
  rating: number;
  comment: string;
  status: string;
}

type DataIndex = keyof DataType;

const ReviewTable = ({ reviews }: any) => {
  // const [reviews, setReviews] = useState([]);
  const searchInput = useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();


  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    dispatch(setSearchText(selectedKeys[0]));
    dispatch(setSearchedColumn(dataIndex));
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    dispatch(setSearchText(""));
  };

  async function reviewIncrement(value: any) {
    try {
      await reviewLike({ id: value.id });
    } catch (error) {
      console.log(error);
    }
  }

  async function reviewDecrement(value: any) {
    try {
      await reviewDisLike({ id: value.id });
    } catch (error) {
      console.log(error);
    }
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              dispatch(setSearchText((selectedKeys as string[])[0]));
              dispatch(setSearchedColumn(dataIndex));
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      global.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[global.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      render: (value) => {
        return (
          <div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Rate allowHalf value={+value.rating} disabled />
                <p>{value.user.name && value.user.name}</p>
              </div>
              <div>{value.createdAt && dayjs(value.createdAt).fromNow()}</div>
            </div>

            {/* review image section */}
            <div className="flex gap-3">
              {["", ""].map((item, idx) => (
                <Image
                  key={idx}
                  // placeholder="blur"
                  className="bg-slate-500"
                  loading="lazy"
                  src="/pos_software.png"
                  width={50}
                  height={50}
                  alt="Picture of the author"
                />
              ))}
            </div>

            <div className="flex justify-between ">
              <div>{value.comment}</div>
              <div className="flex gap-4">
                <div>
                  <BiLike
                    className="size-4 font-bold cursor-pointer"
                    onClick={() => reviewIncrement(value)}
                  />{" "}
                  <span>{value.like}</span>
                </div>
                <div>
                  <BiDislike
                    className="size-4 font-bold cursor-pointer"
                    onClick={() => reviewDecrement(value)}
                  />{" "}
                  <span>{value.disLike}</span>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (value) => (
    //     <div className="gap-2">
    //       <Button
    //         size="small"
    //         icon={<FormOutlined />}
    //         title="Edit"
    //         className="me-1"
    //         onClick={() =>
    //           dispatch(
    //             setAction({
    //               type: ActionType.UPDATE,
    //               payload: value,
    //             })
    //           )
    //         }
    //       />
    //       <Popconfirm
    //         title={
    //           <span>
    //             Are you sure <span className="text-danger fw-bold">delete</span>{" "}
    //             this Review?
    //           </span>
    //         }
    //         onConfirm={() => handleDelete(value.id)}
    //         placement="left"
    //         okText="Yes"
    //         okType="danger"
    //         cancelText="No"
    //         icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    //       >
    //         <Button
    //           size="small"
    //           danger
    //           loading={global.loading?.delete}
    //           icon={<RestOutlined />}
    //         />
    //       </Popconfirm>
    //     </div>
    //   ),
    // },
  ];

  return (
    <Table
      scroll={{ x: "auto" }}

      // loading={global.loading.loading}
      columns={columns}
      dataSource={reviews}
      pagination={{ pageSize: 5 }}
      // bordered
      rowHoverable={false}
      // tableLayout="auto"
      size="small"
    />
  );
};

export default ReviewTable;
