/* eslint-disable react-hooks/exhaustive-deps */
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Descriptions, Modal, Image, Tag, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";
import { getStatus } from "@/lib/utils/getStatus";
import dayjs from "dayjs";
import { getImageUrl } from "@/lib/utils/imageUrl";

const ReturnDetailsModal = () => {
  const global = useSelector(selectGlobal);
  const { payload, orderReturnDetails, type } = global.action;
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  return (
    <Modal
      title="Return Request Details"
      width={700}
      zIndex={1050}
      open={type === ActionType.UPDATE && orderReturnDetails}
      onCancel={handleClose}
      footer={null}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Return ID">{payload?.id}</Descriptions.Item>
        <Descriptions.Item label="Order ID">#{payload?.orderId}</Descriptions.Item>
        
        <Descriptions.Item label="User Name">{payload?.user?.name || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Phone">{payload?.phone || payload?.user?.phone || "N/A"}</Descriptions.Item>
        
        <Descriptions.Item label="Product" span={2}>
          {payload?.product?.name || "Multi-Item Return"}
        </Descriptions.Item>

        <Descriptions.Item label="Requested Qty">{payload?.requestedQty}</Descriptions.Item>
        <Descriptions.Item label="Approved Qty">{payload?.approvedQty || 0}</Descriptions.Item>
        
        <Descriptions.Item label="Request Date" span={2}>
          {payload?.createdAt && dayjs(payload.createdAt).format("DD-MM-YYYY h:mm A")}
        </Descriptions.Item>

        <Descriptions.Item label="Reason" span={2}>
          <Tag color="blue">{payload?.reason}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Status" span={2}>
          <Tag color={getStatus(payload?.status)}>{payload?.status}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Additional Comments" span={2}>
          {payload?.comments || "No comments provided"}
        </Descriptions.Item>

        <Descriptions.Item label="Evidence / Proof" span={2}>
          {payload?.images && payload.images.length > 0 ? (
            <Image.PreviewGroup>
              <Space wrap>
                {payload.images.map((img: string, index: number) => (
                  <Image
                    key={index}
                    src={getImageUrl(img)}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    alt={`proof-${index}`}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          ) : (
            "No evidence images uploaded"
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ReturnDetailsModal;
