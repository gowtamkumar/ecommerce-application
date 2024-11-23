import { Form, Card, Input, Button, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { saveMenu } from "@/lib/apis/menu";

const Index = () => {
  const [form] = Form.useForm();
  const handelMenu = async (value: any) => {
    const menu = await saveMenu(value.items[0]);
    console.log("🚀 ~ menu:", menu);
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
    <Form
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 18 }}
      form={form}
      name="dynamic_form_complex"
      onFinish={handelMenu}
      // style={{ maxWidth: 900 }}
      autoComplete="off"
      initialValues={{ items: [{}] }}
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Item ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }
              >
                <Form.Item
                  label="Name"
                  name={[field.name, "name"]}
                  rules={[
                    {
                      required: true,
                      message: "Name is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {/* Recursive nested list */}
                <NestedList parentField={field} />
              </Card>
            ))}

            {/* <Button type="dashed" onClick={() => add()} block>
              + Add Item
            </Button> */}
          </div>
        )}
      </Form.List>

      <Button
        size="small"
        color="primary"
        htmlType="submit"

      >
        Save
      </Button>

      <Form.Item shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  );
};

export default Index;
