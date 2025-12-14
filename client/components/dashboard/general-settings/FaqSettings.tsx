"use client";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { CaretRightOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Card, Collapse, Empty, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function FaqSettings() {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const faqData = {
    id: global.setting.id,
    faq: global.setting.faq || [],
  };

  form.setFieldsValue(faqData);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const payload = {
      id: values.id,
      faq: values.faq,
    };

    try {
      const res = values.id
        ? await updateSetting(payload)
        : await saveSetting(payload);

      if (!res?.success) {
        errorNotification({ message: res?.message || "Operation failed" });
        return;
      }

      successNotification({ message: res.message || "FAQs updated successfully" });

      // Update global state with new settings
      dispatch(setSetting({ ...global.setting, faq: values.faq }));

    } catch (error: any) {
      errorNotification({
        message: error?.response?.data?.message || error?.message || "Unexpected error",
      });
    } finally {
      setLoading(false);
      dispatch(setAction({}));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={4} className="!mb-1">
          Frequently Asked Questions
        </Title>
        <Text type="secondary">
          Manage the FAQs displayed on your support page.
        </Text>
      </div>

      <Card className="shadow-sm border border-gray-100 rounded-2xl">
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          scrollToFirstError
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.List name="faq">
            {(fields, { add, remove }) => (
              <>
                <div className="flex justify-end mb-4">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    size="large"
                    className="flex items-center"
                  >
                    Add Question
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No generic FAQs added yet"
                    className="bg-gray-50 rounded-xl py-8 border border-gray-100 border-dashed"
                  />
                ) : (
                  <Collapse
                    accordion
                    defaultActiveKey={[0]}
                    className="bg-white border-none space-y-3"
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  >
                    {fields.map(({ key, name, ...restField }) => (
                      <Panel
                        key={key}
                        header={
                          <div className="flex items-center gap-2 font-medium">
                            <span className="text-gray-400">Q{name + 1}:</span>
                            {form.getFieldValue(['faq', name, 'question']) || 'New Question'}
                          </div>
                        }
                        extra={
                          <DeleteOutlined
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(name);
                            }}
                          />
                        }
                        className="bg-gray-50/50 border border-gray-100 rounded-xl overflow-hidden [&_.ant-collapse-content]:border-t-gray-100"
                      >
                        <div className="pt-2">
                          <Form.Item
                            {...restField}
                            name={[name, "question"]}
                            label="Question"
                            rules={[{ required: true, message: "Missing question" }]}
                          >
                            <Input
                              placeholder="e.g. What is your return policy?"
                              size="large"
                              prefix={<QuestionCircleOutlined className="text-gray-300" />}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "answer"]}
                            label="Answer"
                            rules={[{ required: true, message: "Missing answer" }]}
                            className="!mb-0"
                          >
                            <Input.TextArea
                              rows={4}
                              placeholder="Enter the detailed answer..."
                              className="resize-none"
                            />
                          </Form.Item>
                        </div>
                      </Panel>
                    ))}
                  </Collapse>
                )}
              </>
            )}
          </Form.List>

          <Form.Item className="!mb-0 !mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="!bg-black hover:!bg-gray-800 !rounded-xl !h-11 !px-8 !font-medium"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
