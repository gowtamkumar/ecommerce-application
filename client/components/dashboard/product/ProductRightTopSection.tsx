import { Checkbox, Form, Input, Select, Tag, TreeSelect } from "antd";

export default function ProductRightTopSection({
  brands,
  categories,
  inputValue,
  setInputValue,
  units,
  tags,
  setTags,
}: any) {
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue]);
        setInputValue(" ");
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-2  gap-3 items-center">
        <div className="col-span-1">
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Status is required",
              },
            ]}
          >
            <Select showSearch allowClear placeholder="Select Status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="col-span-1 self-end">
          <Form.Item name="featured" valuePropName="checked" label={null}>
            <Checkbox>Featured</Checkbox>
          </Form.Item>
        </div>
      </div>

      <Form.Item name="brandId" label="Brand">
        <Select
          showSearch
          allowClear
          placeholder="Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as any)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {(brands || []).map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="productCategories"
        label="Category"
        rules={[
          {
            required: true,
            message: "Category is required",
          },
        ]}
      >
        <TreeSelect
          showSearch
          style={{ width: "100%" }}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          treeData={categories}
          multiple
        />
        {/* <Select
          showSearch
          allowClear
          placeholder="Select"
          mode="multiple"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as any)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {(categories || []).map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select> */}
      </Form.Item>

      <Form.Item
        name="unitId"
        label="Unit"
        rules={[
          {
            required: true,
            message: "Unit is required",
          },
        ]}
      >
        <Select
          showSearch
          allowClear
          placeholder="Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as any)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {(units || []).map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div>
        <label htmlFor="tags">Tags</label>
        <Input
          type="text"
          id="tags"
          value={inputValue}
          onPressEnter={handleKeyPress}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something and press Enter"
        />
        <div className="flex mt-2">
          {(tags || []).map((item: any, index: number) => (
            <Tag key={index}>
              {item}{" "}
              <span
                onClick={() =>
                  setTags(tags.filter((item: any, idex: any) => idex !== index))
                }
                className="cursor-pointer"
              >
                X
              </span>
            </Tag>
          ))}
        </div>
      </div>
    </>
  );
}
