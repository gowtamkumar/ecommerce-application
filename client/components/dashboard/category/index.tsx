"use client";
import { ActionType } from "@/constants/constants";
import {
    CategoryTreeRow,
    deleteCategory,
    getAntdCategories,
    getCategories,
    PaginatedCategories,
} from "@/lib/apis/categories";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { imageSetFile } from "@/lib/utils/imageSetFile";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

const CategoryList = dynamic(() => import("@/components/dashboard/category/CategoryList"), { ssr: false });
const AddCategory = dynamic(() => import("@/components/dashboard/category/AddCategory"), { ssr: false });

export interface CategoryAction {
  type: string;
  payload?: CategoryTreeRow;
}

export default function Category() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, loading, refresh } = useAsyncData<PaginatedCategories>(
    () => getCategories({ page, perPage: pageSize, search: search || undefined }),
    `${page}-${pageSize}-${search}`,
  );

  // Full tree for parent category TreeSelect in AddCategory modal
  const { data: antdTreeData, refresh: refreshTree } = useAsyncData(getAntdCategories);
  const treeData = useMemo(() => antdTreeData?.data ?? [], [antdTreeData]);

  const categories = useMemo(() => data?.data ?? [], [data]);
  const totalItem = useMemo(() => data?.totalItem ?? data?.total ?? 0, [data]);

  const [action, setAction] = useState<CategoryAction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openCreate = useCallback(() => setAction({ type: ActionType.CREATE }), []);
  const closeForm = useCallback(() => setAction(null), []);

  const openEdit = useCallback((record: CategoryTreeRow) => {
    const payload = { ...record } as CategoryTreeRow & { fileList?: any[] };
    if (payload.image) {
      payload.fileList = [imageSetFile(payload.image)];
    }
    setAction({ type: ActionType.UPDATE, payload });
  }, []);

  const handleSaved = useCallback(() => {
    refresh();
    refreshTree();
    setAction(null);
  }, [refresh, refreshTree]);

  const handleDelete = useCallback(
    async (id: number) => {
      setDeletingId(id);
      try {
        const res = await deleteCategory(id);
        if (!res?.success) {
          errorNotification({ message: res?.message || "Delete failed" });
          return;
        }
        successNotification({ message: "Successfully deleted" });
        refresh();
        refreshTree();
      } catch (error: any) {
        errorNotification({ message: error.message });
      } finally {
        setDeletingId(null);
      }
    },
    [refresh, refreshTree],
  );

  const handlePageChange = useCallback(
    (newPage: number, newPageSize: number) => {
      setPage(newPage);
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        setPage(1);
      }
    },
    [pageSize],
  );

  const handleSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-global-primary-fontfamily">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products with categories and sub-categories</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="h-10 px-6 font-medium shadow-sm transition-all"
          style={{ borderRadius: "var(--button-border-radius)" }}
          onClick={openCreate}
        >
          Add Category
        </Button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <CategoryList
          categories={categories}
          totalItem={totalItem}
          loading={loading}
          page={page}
          pageSize={pageSize}
          search={search}
          deletingId={deletingId}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddCategory
        open={action !== null}
        mode={action?.type === ActionType.UPDATE ? "update" : "create"}
        payload={action?.payload ?? null}
        treeData={treeData}
        onCancel={closeForm}
        onSaved={handleSaved}
      />
    </div>
  );
}