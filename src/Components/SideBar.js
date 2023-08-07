import logo from '../images/icon.png'
import { CgProfile } from 'react-icons/cg'
import { BsFileEarmarkPostFill, BsHouses } from 'react-icons/bs'
import { BiTimeFive, BiLogOutCircle } from 'react-icons/bi'
import { FaFileSignature } from 'react-icons/fa'
import { MdOutlineDashboard } from 'react-icons/md'
import { Layout, Menu, Image } from 'antd'
import '../Pages/agent/AgentHome.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase-client'


function Sidebar({ value, setTitle }) {

    const { Sider } = Layout;
    const navigate = useNavigate();


    useEffect(() => {
        const storedKey = localStorage.getItem('selectedKey');
        if (storedKey) {
            setSelectedKey(storedKey);
        }
    }, []);

    const [selectedKey, setSelectedKey] = useState('')

    return (
        <Sider trigger={null} collapsible collapsed={value} collapsedWidth={90} width={220}
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                height: '100%',
                overflowY: 'auto',
                zIndex: '100',
            }}>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[selectedKey]}
                selectedKeys={[selectedKey]}
                style={{
                    backgroundColor: '#d5def5',
                    height: '100%',
                    overflowY: 'auto',
                }}
                onClick={async({ key }) => {
                    if (key === '/logout') {
                        await supabase.auth.signOut();
                        localStorage.removeItem('selectedKey');
                        navigate('/');
                        return;
                    } else {
                        setSelectedKey(key);
                        localStorage.setItem('selectedKey', key);
                        setTitle(key)
                        navigate(key)
                    }
                }}
                items={[
                    {
                        key: 'logo',
                        icon: <Image width={45} src={logo} preview={false} style={{ marginLeft: '-10px', marginRight: '0px' }} />,
                        label: <span style={{ marginLeft: '10px', fontSize: '20px', color: 'black' }}>EzRent</span>,
                        style: { height: 'auto' },
                        disabled: "true",
                    },
                    {
                        key: '/agent',
                        icon: <MdOutlineDashboard style={{ width: '25px', height: 'auto' }} />,
                        label: 'Dashboard',
                    },
                    {
                        key: '/agent/rentedProperty',
                        icon: <BsHouses style={{ width: '25px', height: 'auto' }} />,
                        label: 'Rented Property',
                    },
                    {
                        key: '/agent/roomRental',
                        icon: <BsFileEarmarkPostFill style={{ width: '25px', height: 'auto' }} />,
                        label: 'Post Listing',
                    },
                    {
                        key: '/agent/appointment',
                        icon: <BiTimeFive style={{ width: '25px', height: 'auto' }} />,
                        label: 'Appointment',
                    },
                    {
                        key: '/agent/rentalAgreement',
                        icon: <FaFileSignature style={{ width: '25px', height: 'auto' }} />,
                        label: 'Rental Agreement',
                    },
                    {
                        key: '/agent/profile',
                        icon: <CgProfile style={{ width: '25px', height: 'auto' }} />,
                        label: 'Profile',
                    },
                    {
                        key: '/logout',
                        icon: <BiLogOutCircle style={{ width: '25px', height: 'auto' }} />,
                        style: { position: 'absolute', bottom: '0', width: '95%' },
                        label: 'Logout',
                    },
                ]}
            />
        </Sider>
    );
}

export default Sidebar;