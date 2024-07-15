"use client";
import { Input, Select } from "antd";
export default function HeaderSearch({ categories = [] }: any) {


  const { Option } = Select;
  const { Search } = Input;

  const selectBefore = (
    <Select defaultValue="Select Category">
      {(categories?.data || []).map((categoroy: any) => (
        <Option key={categoroy.id} value={categoroy.id}>
          {categoroy.name}
        </Option>
      ))}
    </Select>
  );
  return (
    <div className="w-8/12">
      <Search
        addonBefore={selectBefore}
        width={100}
        size="large"
      // defaultValue="mysite"
      />
    </div>
  );
}
