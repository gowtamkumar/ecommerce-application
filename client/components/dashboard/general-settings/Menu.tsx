"use client";
import { Form, Card, Input, Button, Select, Space, Checkbox, Typography } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { getDashboardMenus, saveMenu, updateMenu } from "@/lib/apis/admin/menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const { Title, Text } = Typography;

const Index = () => {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState("");
  const [selectData, setSelectData] = useState({});
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    (async () => {
      const menu = await getDashboardMenus();
      setMenus(menu.data);
    })();
  }, []);

  const handelSave = async (value: any) => {
    const result = () => updateMenu(value);
    await handleAsyncAction(result, dispatch);
  };

  const createMenu = async () => {
    const result = () => saveMenu({ name: newMenu });
    const handleRes = await handleAsyncAction(result, dispatch);

    if (handleRes.success) {
      form.setFieldsValue({
        ...handleRes.data,
        items: [{}],
      });
      setNewMenu("");
    }
  };

  const selectMenu = async () => {
    dispatch(setLoading({ selectMenu: true }));
    form.setFieldsValue(selectData);
    setTimeout(() => {
      dispatch(setLoading({}));
    }, 1000);
  };

  const NestedList = ({ parentField }: any) => (
    <Form.Item label={<span className="text-sm font-medium">Sub Items</span>}>
      <Form.List name={[parentField.name, "children"]}>
        {(subFields, subOpt) => (
          <div className="space-y-3">
            {subFields.map((subField) => (
              <div
                key={subField.key}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex gap-2 mb-3">
                  <Form.Item
                    noStyle
                    name={[subField.name, "label"]}
                    rules={[
                      {
                        required: true,
                        message: "Label is required",
                      },
                    ]}
                  >
                    <Input placeholder="Menu Label" size="large" className="flex-1" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    name={[subField.name, "url"]}
                    rules={[
                      {
                        required: true,
                        message: "URL is required",
                      },
                    ]}
                  >
                    <Input placeholder="/page-url" size="large" className="flex-1" />
                  </Form.Item>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    size="large"
                    onClick={() => {
                      subOpt.remove(subField.name);
                    }}
                  />
                </div>

                {/* Recursive call to NestedList for deeper levels */}
                <NestedList parentField={subField} />
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => subOpt.add()}
              icon={<PlusOutlined />}
              size="large"
              block
              className="!border-gray-300 hover:!border-blue-500 hover:!text-blue-500"
            >
              Add Sub Item
            </Button>
          </div>
        )}
      </Form.List>
    </Form.Item>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={4} className="!mb-1">
          Menu Management
        </Title>
        <Text type="secondary">
          Create and manage navigation menus for your website
        </Text>
      </div>

      {/* Menu Actions */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Select Menu */}
          <div>
            <Text className="block mb-2 text-sm font-medium">Select Existing Menu</Text>
            <Space.Compact className="w-full sm:w-auto">
              <Select
                style={{ width: 200 }}
                size="large"
                showSearch
                allowClear
                placeholder="Choose a menu"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as any)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => {
                  if (value) {
                    const singlseMenu: any = menus.find(
                      (item: { id: number }) => item.id === value
                    );

                    (singlseMenu.items = singlseMenu.items
                      ? singlseMenu.items
                      : [{}]),
                      setSelectData(singlseMenu);
                  } else {
                    form.resetFields();
                  }
                }}
              >
                {menus?.map((item: { name: string; id: number }) => (
                  <Select.Option key={item.id} value={item.id}>
                    {`${item.name}`}
                  </Select.Option>
                ))}
              </Select>

              <Button
                type="primary"
                size="large"
                loading={global.loading.selectMenu}
                onClick={selectMenu}
                className="!bg-blue-600 hover:!bg-blue-700"
              >
                Load Menu
              </Button>
            </Space.Compact>
          </div>

          {/* Create Menu */}
          <div>
            <Text className="block mb-2 text-sm font-medium">Create New Menu</Text>
            <Space.Compact className="w-full sm:w-auto">
              <Input
                size="large"
                placeholder="Enter menu name"
                value={newMenu}
                onChange={(v) => setNewMenu(v.target.value)}
                onPressEnter={createMenu}
              />
              <Button
                size="large"
                disabled={!newMenu || global.loading.save}
                onClick={createMenu}
                loading={global.loading.save}
                className="!bg-green-600 hover:!bg-green-700 !text-white"
              >
                Create
              </Button>
            </Space.Compact>
          </div>
        </div>
      </Card>

      {/* Menu Form */}
      <Form
        form={form}
        name="dynamic_form_complex"
        layout="vertical"
        onFinish={handelSave}
        autoComplete="off"
        initialValues={{ items: [{}] }}
      >
        <Card
          size="small"
          title={
            <span className="text-lg font-semibold">
              {form.getFieldValue("name") ? `Editing: ${form.getFieldValue("name")}` : "Menu Editor"}
            </span>
          }
          className="shadow-sm border border-gray-100 rounded-2xl"
        >
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-base font-medium">Menu Name</span>}
            name="name"
            rules={[
              {
                required: true,
                message: "Menu name is required",
              },
            ]}
          >
            <Input size="large" placeholder="E.g. Main Navigation, Footer Links" />
          </Form.Item>

          <div className="my-6">
            <Text className="text-base font-medium block mb-3">Menu Items</Text>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <Card key={field.key} className="bg-gray-50 border border-gray-200">
                      <NestedList parentField={field} />
                    </Card>
                  ))}
                </div>
              )}
            </Form.List>
          </div>

          {/* Menu Placement */}
          <div className="border-t pt-4 mt-6">
            <Text className="text-base font-medium block mb-3">Menu Placement</Text>
            <div className="flex flex-wrap gap-6">
              <Form.Item
                name="topBarMenu"
                valuePropName="checked"
                label={null}
                className="!m-0"
              >
                <Checkbox className="text-base">Top Bar Menu</Checkbox>
              </Form.Item>

              <Form.Item
                name="mainMenu"
                valuePropName="checked"
                label={null}
                className="!m-0"
              >
                <Checkbox className="text-base">Main Menu</Checkbox>
              </Form.Item>

              <Form.Item
                name="footerMenu"
                valuePropName="checked"
                label={null}
                className="!m-0"
              >
                <Checkbox className="text-base">Footer Menu</Checkbox>
              </Form.Item>

              <div className="ml-auto">
                <Form.Item
                  name="active"
                  valuePropName="checked"
                  label={null}
                  className="!m-0"
                >
                  <Checkbox className="text-base font-medium">Active</Checkbox>
                </Form.Item>
              </div>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            loading={global.loading.save}
            disabled={global.loading.save}
            htmlType="submit"
            className="!h-11 !px-8 !font-medium mt-6"
            style={{ borderRadius: "var(--button-border-radius)" }}
          >
            Save Menu
          </Button>
        </Card>
      </Form>
    </div>
  );
};

export default Index;
