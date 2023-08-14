import SearchInput from '../../Components/SearchInput';
import { Col, Row, Button, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import FurnishTypeSelection from '../../Components/FurnishTypeSelection';
import MinRentSelection from '../../Components/MinRentSelection';
import MaxRentSelection from '../../Components/MaxRentSelection';
import BuiltupSizeSelection from '../../Components/BuiltupSizeSelection';
import StateSelection from '../../Components/StateSelection';
import CategorySelection from '../../Components/CategorySelection';




function Home() {

    const containerStyle = {
        // display: 'grid',
        // gridTemplateRows: 'auto',
        // gap: '10px',
        // alignItems: 'center',
        margin: '5% 10% 0%',
        background: '#8594e4',
        borderRadius: '10px',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
    };


    const onFinish = (e) => {
        console.log(e);

        // TODO: Check if isError is true or false
    };


    const [state, setState] = useState('All States');
    const [input, setInput] = useState('null');
    const [furnish, setFurnish] = useState('null');
    const [minRent, setMinRent] = useState(null)
    const [maxRent, setMaxRent] = useState(null)
    const [size, setSize] = useState('500')
    const [category, setCategory] = useState(null)
    const [isError, setIsError] = useState(false)
    let errorMessage = "*Minimum rent cannot larger than maximum rent";

    const handleStateChange = (e) => {
        setState(e);
    }

    const handleInputChange = (e) => {
        setInput(e);
    }

    const handleFurnishChange = (e) => {
        setFurnish(e);
    }

    const handleMinRentChange = (e) => {
        if (maxRent !== null ){
            if (e > maxRent) {
                setIsError(true);
                setMinRent(e);
                return;
            }
        }
        setMinRent(e);
        setIsError(false);
    }

    const handleMaxRentChange = (e) => {
        if (e < minRent) {
            setIsError(true);
            setMaxRent(e);
            return;
        }
        setMaxRent(e);
        setIsError(false);
    }

    return <>
        <div style={containerStyle}>
            <Row wrap={true} gutter={160}>
                <Col span={24}><h3 style={{ textAlign: 'center' }}>Room Rental</h3></Col>
            </Row>
            <Form
                onFinish={onFinish}
                initialValues={
                    {
                        stateSelection: null,
                        furnishType: null,
                        minRent: null,
                        maxRent: null,
                        builtUpSize: 0,
                        searchInput: 'null',
                        category: category,
                    }
                }>
                <Row style={{ marginLeft: '5%', height: '40px' }}>
                    <Col span={4}>
                        <Form.Item name="stateSelection">
                            <StateSelection  style={{ width: '80%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={16}>
                        <Form.Item name="searchInput">
                            <SearchInput placeholder='Search by location or property name' style={{ width: '90%' }}  />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item>
                            <Button htmlType='submit' style={{ display: 'flex', alignItems: 'center', backgroundColor: '#6643b5' }} type="primary" icon={<SearchOutlined />}><Col />
                                Search
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>


                <Row style={{ marginLeft: '6%', marginTop: '10px', marginRight: '5%', height: '30px' }}>
                    <Col span={4}>
                        <Form.Item name='furnishType'>
                            <FurnishTypeSelection bordered={false} style={{ width: '95%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item name="category">
                            <CategorySelection  style={{ width: '80%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item name="minRent">
                            <MinRentSelection value={minRent} onChange={handleMinRentChange} style={{ width: '85%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item name="maxRent">
                            <MaxRentSelection value={maxRent} onChange={handleMaxRentChange} style={{ width: '85%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item name="builtUpSize">
                            <BuiltupSizeSelection style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>         
                </Row>
                <Row style={{ marginLeft: '35%', paddingBottom: '10px' }}>
                    <Col style={{ color: '#b80606', fontStyle: 'italic' }}>{isError && errorMessage}</Col>
                </Row>
            </Form>
        </div>

    </>
};

export default Home;