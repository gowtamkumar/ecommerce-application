import { Form, Card, Input, Button, Typography, Select, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { getDashboardMenus, saveMenu } from "@/lib/apis/admin/menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";

const Index = () => {
  const [menuData, setMenuData] = useState({});
  const [newMenu, setNewMenu] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(()=> {
    (async()=> {
      const menu = await getDashboardMenus()
      console.log("🚀 ~ menu dsfasdf:", menu)

    })()
  }, [])

  const handelMenu = async (value: any) => {
    const menu = await saveMenu(value.items[0]);
    console.log("🚀 ~ menu:", menu);
  };

  const createMenu = async () => {
    dispatch(setLoading({ menuName: true }));

    const menu = await saveMenu({ name: newMenu });
    console.log("🚀 ~ menu:", menu);

    form.setFieldsValue({ name: menu.data.name });

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
              defaultValue="lucy"
              style={{ width: 170 }}
              // onChange={handleChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "yiminghe" },
              ]}
            />

            <Button type="primary">Select</Button>
          </Space.Compact>
        </div>
        <div className="flex">
          <Space.Compact>
            <Input
              placeholder="Enter Name"
              onChange={(v) => setNewMenu(v.target.value)}
            />
            <Button
              disabled={!newMenu}
              onClick={createMenu}
              loading={global.loading.menuName}
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
        onFinish={handelMenu}
        // style={{ maxWidth: 900 }}
        autoComplete="off"
        initialValues={{ items: [{}] }}
      >
        <Card size="small" title={`Main menu`}>
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

          <Button size="small" color="primary" htmlType="submit">
            Save
          </Button>
        </Card>

        <Form.Item shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Index;
