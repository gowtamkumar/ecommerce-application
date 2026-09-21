"use client";
import { ActionType } from "@/constants/constants";
import { deleteBrand, getBrands, type Brand as BrandItem } from "@/lib/apis/brand";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { imageSetFile } from "@/lib/utils/imageSetFile";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

const BrandList = dynamic(() => import("@/components/dashboard/brand/BrandList"), { ssr: false });
const AddBrand = dynamic(() => import("@/components/dashboard/brand/AddBrand"), { ssr: false });

interface BrandListResponse {
  success: boolean;
  data?: BrandItem[];
}

export interface BrandAction {
  type: string;
  payload?: BrandItem;
}

export default function Brand() {
  const { Title, Text } = Typography;
  const { data, loading, refresh } = useAsyncData<BrandListResponse>(getBrands);
  const brands = useMemo(() => data?.data ?? [], [data]);

  const [action, setAction] = useState<BrandAction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openCreate = useCallback(() => setAction({ type: ActionType.CREATE }), []);
  const closeForm = useCallback(() => setAction(null), []);

  const openEdit = useCallback((record: BrandItem) => {
    const payload = { ...record } as BrandItem & { fileList?: any[] };
    if (payload.image) {
      payload.fileList = [imageSetFile(payload.image)];
    }
    setAction({ type: ActionType.UPDATE, payload });
  }, []);

  const handleSaved = useCallback(() => {
    refresh();
    setAction(null);
  }, [refresh]);

  const handleDelete = useCallback(
    async (id: number) => {
      setDeletingId(id);
      try {
        const res = await deleteBrand(id);
        if (!res?.success) {
          errorNotification({ message: res?.message || "Delete failed" });
          return;
        }
        successNotification({ message: "Successfully deleted" });
        refresh();
      } catch (error: any) {
        errorNotification({ message: error.message });
      } finally {
        setDeletingId(null);
      }
    },
    [refresh],
  );

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={4} className="mb-1">
            Product Brands
          </Title>
          <Text type="secondary">Manage product brands and manufacturers</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreate}
          className="h-10 px-6 font-medium"
          style={{ borderRadius: "var(--button-border-radius)" }}
        >
          New Brand
        </Button>
      </div>

      <Card
        className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <BrandList
          brands={brands}
          loading={loading}
          deletingId={deletingId}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </Card>

      <AddBrand
        open={action !== null}
        mode={action?.type === ActionType.UPDATE ? "update" : "create"}
        payload={action?.payload ?? null}
        onCancel={closeForm}
        onSaved={handleSaved}
      />
    </div>
  );
}