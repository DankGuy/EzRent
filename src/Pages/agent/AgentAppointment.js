import { DatePicker, Row, Col, Checkbox, Button, Divider } from "antd";
import moment from "moment";
import { useState } from "react";


function AgentAppointment() {

    const [checkedList, setCheckedList] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);


    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');

    }

    const onChangeDate = (date, dateString) => {
        console.log(date, dateString);
        if (!date){
            setIsDisabled(true);
            return;
        }
        setIsDisabled(false);
    }

    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < defaultOptions.length);
        setCheckAll(list.length === defaultOptions.length);
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? defaultOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const defaultOptions = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 13:00',
        '13:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 17:00',
        '17:00 - 18:00',
        '18:00 - 19:00',
        '19:00 - 20:00',
    ];

    return <>

        <h1>Set Available Timeslot</h1>
        <div style={{ border: '1px solid red', height: '300px', display: 'flex' }}>
            <div style={{ border: '1px solid blue', width: '50%', height: '300px' }}>
                <DatePicker
                    format='DD-MM-YYYY'
                    disabledDate={disabledDate}
                    onChange={onChangeDate}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ border: '1px solid blue', width: '100%', height: '300px' }}>

                    <Checkbox.Group options={defaultOptions} value={checkedList} onChange={onChange} disabled={isDisabled} />

                    <Divider />
                    <Row>
                        <Col span={8}>
                            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} disabled={isDisabled}>
                                Check All
                            </Checkbox>
                        </Col>
                    </Row>
                </div>

                <div style={{ border: '1px solid blue', width: '100%', height: '300px' }}>
                    <Row>
                        <Col span={8}>
                            <Button type="primary" block>Save</Button>
                        </Col>
                        <Col span={8}>
                            <Button type="primary" block>Cancel</Button>
                        </Col>
                    </Row>
                </div>
            </div>

            <div>
                {checkedList}
            </div>

        </div>


    </>
}

export default AgentAppointment;