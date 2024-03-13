import { Layout } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

function FooterOption() {
  return (
    <Footer style={{ textAlign: "center" }}>
          ©{new Date().getFullYear()} Developed by Gowtam Kumar
    </Footer>
  )
}

export default FooterOption