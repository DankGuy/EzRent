import { Layout } from 'antd';
import NavBar from '../../Components/NavBar'
import { Outlet } from "react-router-dom";


function StudentLayout() {

    const { Content } = Layout;

    return <>


        <Layout>
            <NavBar />
            <Content style={{ marginTop: 50 }}>
                <Outlet />
            </Content>
        </Layout>
    </>
}

export default StudentLayout;