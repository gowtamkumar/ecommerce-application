import React from 'react'
import { Tabs } from 'antd';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import Header from '@/components/website/Header';
import WebFooter from '@/components/website/Footer';


export default function Profile() {
  return (
    <div className='container mx-auto'>
      <Header />
      <Tabs
        // type='line'
        tabPosition='left'
        defaultActiveKey="2"
        items={[AppleOutlined, AndroidOutlined].map((Icon: any, i) => {
          const id = String(i + 1);
          return {
            key: id,
            label: `Tab ${id}`,
            children: `Tab ${id}`,
            icon: <Icon />,
          };
        })}
      />
      <WebFooter />
    </div>
  )
}
