import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';


function NotFound({ backTo }) {

    const navigate = useNavigate();

    const handleBackHome = () => {
        if (backTo === "login") {
            navigate("/login");
        } else if (backTo === "student") {
            navigate("/student");
        } else if (backTo === "agent") {
            navigate("/agent");
        } 
    }

    const extraButton = <Button type="primary" onClick={handleBackHome} 
    style={{
        backgroundColor: "#0062D1",
        borderColor: "#0062D1",
        marginTop: "5px",
        width: "12vw",
        fontSize: "1.2em",
        height: "auto",
      }}>
        Back to {backTo === "login" ? " Login" : " Home"} 
    </Button>;

    return <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        style={{ height: "100vh", background: "white" }}
        extra={extraButton}
    />;
}

export default NotFound;