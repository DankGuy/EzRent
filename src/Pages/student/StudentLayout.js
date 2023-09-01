import { Layout } from 'antd';
import NavBar from '../../Components/NavBar'
import { Outlet } from "react-router-dom";
import FooterCard from './footer/FooterCard';
const { Footer } = Layout;


function StudentLayout() {

    const { Content } = Layout;

    return <>


        <Layout>
            <NavBar />
            <Content style={{ marginTop: 40 }}>
                <Outlet />
            </Content>
            <Footer style={{padding: 0}}>
                <FooterCard/>
            </Footer>
        </Layout>
    </>
}

export default StudentLayout;