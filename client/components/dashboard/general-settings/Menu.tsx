"use client";
import { Form, Card, Input, Button, Select, Space, Checkbox } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { getDashboardMenus, saveMenu, updateMenu } from "@/lib/apis/admin/menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

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

    console.log(handleRes);

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
    <Form.Item label="List">
      <Form.List name={[parentField.name, "children"]}>
        {(subFields, subOpt) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 20,
            }}
          >
            {subFields.map((subField) => (
              <div
                key={subField.key}
                style={{
                  color: "red",
                  backgroundColor: "#F4F4F4",
                  padding: "10px",
                }}
              >
                <div className="flex gap-2">
                  <Form.Item
                    noStyle
                    name={[subField.name, "label"]}
                    rules={[
                      {
                        required: true,
                        message: "label is required",
                      },
                    ]}
                  >
                    <Input placeholder="Label" />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    name={[subField.name, "url"]}
                    rules={[
                      {
                        required: true,
                        message: "Url is required",
                      },
                    ]}
                  >
                    <Input placeholder="URL" />
                  </Form.Item>
                  <CloseOutlined
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
              className="my-3"
              type="dashed"
              onClick={() => subOpt.add()}
              block
            >
              + Add Sub Item
            </Button>
          </div>
        )}
      </Form.List>
    </Form.Item>
  );

  return (
    <div>
      <div className="flex justify-between my-5">
        <div>
          <Space.Compact>
            <Select
              style={{ width: 170 }}
              showSearch
              allowClear
              placeholder="Select "
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
              {menus.map((item: { name: string; id: number }) => (
                <Select.Option key={item.id} value={item.id}>
                  {`${item.name}`}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              loading={global.loading.selectMenu}
              onClick={selectMenu}
            >
              Select
            </Button>
          </Space.Compact>
        </div>
        <div className="flex">
          <Space.Compact>
            <Input
              placeholder="Enter Name"
              value={newMenu}
              onChange={(v) => setNewMenu(v.target.value)}
            />
            <Button
              disabled={!newMenu || global.loading.save}
              onClick={createMenu}
              loading={global.loading.save}
            >
              Create Menu
            </Button>
          </Space.Compact>
        </div>
      </div>

      <Form
        // labelCol={{ span: 1 }}
        // wrapperCol={{ span: 18 }}
        form={form}
        name="dynamic_form_complex"
        onFinish={handelSave}
        // style={{ maxWidth: 900 }}
        autoComplete="off"
        initialValues={{ items: [{}] }}
      >
        <Card size="small" title={`${form.getFieldValue("name") || ""}`}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
              >
                {fields.map((field) => (
                  <Card key={field.key}>
                    <NestedList parentField={field} />
                  </Card>
                ))}
                {/* 
            <Button type="dashed" onClick={() => add()} block>
              + Add Item
            </Button> */}
              </div>
            )}
          </Form.List>

          <div className="flex justify-between items-center">
            <div>
              <Form.Item
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                name="topBarMenu"
                valuePropName="checked"
                label={null}
                className="m-0 p-0"
              >
                <Checkbox>Top Bar Menu</Checkbox>
              </Form.Item>

              <Form.Item
                name="mainMenu"
                valuePropName="checked"
                label={null}
                className="m-0 p-0"
              >
                <Checkbox>Main Menu</Checkbox>
              </Form.Item>

              <Form.Item
                name="footerMenu"
                valuePropName="checked"
                label={null}
                className="m-0 p-0"
              >
                <Checkbox>Footer Menu</Checkbox>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="active"
                valuePropName="checked"
                label={null}
                className="m-0 p-0"
              >
                <Checkbox>Active</Checkbox>
              </Form.Item>
            </div>
          </div>

          <Button
            size="small"
            color="primary"
            loading={global.loading.save}
            disabled={global.loading.save}
            htmlType="submit"
          >
            Save
          </Button>
        </Card>

        {/* <Form.Item shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default Index;
