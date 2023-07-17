import { Button, Result } from 'antd';


function LoadingPage() {
    return <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        style={{ height: "100vh", background: "black" }}
    />;
}

export default LoadingPage;