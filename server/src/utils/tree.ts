export interface TreeItem {
  id: number;
  name: string;
  children?: TreeItem[] | null;
}

export type AntdTreeRow<T extends TreeItem = TreeItem> = T & {
  key: string;
  value: number;
  label: string;
  title: string;
  children: AntdTreeRow<T>[] | null;
};

/**
 * Convert a hierarchical entity list into antd Table / TreeSelect rows.
 * Generic across any nested resource (categories, menus, departments...)
 * by relying on the common { id, name, children } shape.
 */
export const toAntdTreeRows = <T extends TreeItem>(nodes: T[]): AntdTreeRow<T>[] =>
  nodes.map((node) => ({
    ...node,
    key: String(node.id),
    value: node.id,
    label: node.name,
    title: node.name,
    children: node.children?.length ? toAntdTreeRows(node.children as T[]) : null,
  }));
