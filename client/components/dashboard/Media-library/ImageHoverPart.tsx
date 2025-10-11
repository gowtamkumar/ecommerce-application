import {
  EyeOutlined,
  QuestionCircleOutlined,
  RestOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export default function ImageHoverPart({ handleView, img, handleDelete }: any) {
  return (
    <div className="absolute inset-0 bg-blue-100/30 hidden group-hover:flex justify-center items-center gap-2 text-white font-medium rounded-md">
      <Button
        size="small"
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering handleSelect
          handleView(img);
        }}
        icon={<EyeOutlined />}
      />

      <Popconfirm
        title={
          <span>
            Are you sure <span className="text-danger fw-bold">delete</span>{" "}
            this?
          </span>
        }
        onConfirm={() => handleDelete(img)}
        placement="left"
        okText="Yes"
        okType="danger"
        cancelText="No"
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      >
        <Button size="small" danger icon={<RestOutlined />} />
      </Popconfirm>
    </div>
  );
}
