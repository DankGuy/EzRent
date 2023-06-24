import {IoAddCircle} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

function AgentRoomRental(){

    const navigate = useNavigate();

    const createPost = () => {
        console.log("hi")
        navigate("/agent/roomRental/createNewPost")
    }
    return <>
        <h1>Room Rental Post</h1>

        <div>
            <div 
                style={{
                    width: '220px', 
                    height: '230px', 
                    border: '1px red solid', 
                    display: 'flex', 
                    flexDirection: 'column' ,
                    justifyContent: 'center', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#E7E7E7'
                    }}
                onClick={createPost}
                >
                <IoAddCircle size={50}/>
                <p>Create new post</p>
            </div>
        </div>
    
    </>
}

export default AgentRoomRental;