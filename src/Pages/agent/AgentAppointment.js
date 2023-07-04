import { DatePicker, Row, Col, Checkbox, Button, Divider, message } from "antd";
import moment from "moment";
import { useState } from "react";
import { supabase } from "../../supabase-client";
import { useEffect } from "react";



function AgentAppointment() {

    const [checkedList, setCheckedList] = useState(null);
    const [isEditBtnDisabled, setIsEditBtnDisabled] = useState(true);
    const [isCheckBoxDisabled, setIsCheckBoxDisabled] = useState(true);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);


    useEffect(() => {
        getOptions();
    }, []);

    useEffect(() => {
        // console.log(checkedList);
        getOptions();
    }, [selectedDate]);



    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');

    }

    const onChangeDate = (date, dateString) => {
        console.log(date, dateString);
        if (!date) {
            setIsEditBtnDisabled(true);
            setCheckedList(null);
            setIsEditBtnDisabled(true);
            // setIsCheckBoxDisabled(true);
            return;
        }
        setIsEditBtnDisabled(false);
        //Convert the date to the format of YYYY-MM-DD
        setSelectedDate(date.format('YYYY-MM-DD'));
        setIsEditBtnDisabled(false);
        // setIsCheckBoxDisabled(false);

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
        setIsCheckedAll(!isCheckedAll);
    };

    async function getOptions() {
        const options = [
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
            '20:00 - 21:00',
            '21:00 - 22:00',
        ];

        if (!selectedDate) {
            setDefaultOptions(options);
            return options;
        }

        const userID = (await supabase.auth.getUser()).data.user.id;

        console.log(userID);

        //Get the available time slot from the supabase with the selected date and agent id
        const { data, error } = await supabase
            .from('available_timeslot')
            .select('timeslot')
            .eq('agentID', userID)
            .eq('date', selectedDate);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        const newOptions = [];

        if (data.length > 0) {
            data.forEach((timeslots) => {

                timeslots.timeslot.forEach((timeslot) => {
                    console.log(timeslot);
                    const index = options.findIndex((option) => option === timeslot);
                    console.log(index);

                    if (index > -1) {
                        newOptions.push(timeslot);

                    }
                });
            });
            setCheckedList(newOptions);
        }
        else {
            setCheckedList(null);
        }
    }

    
    async function saveTimeslot() {
        const userID = (await supabase.auth.getUser()).data.user.id;

        const { data, error } = await supabase
            .from('available_timeslot')
            .select('timeslotID')
            .eq('agentID', userID)
            .eq('date', selectedDate);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        if (data.length > 0) {
            const { data, error } = await supabase
                .from('available_timeslot')
                .update({ timeslot: checkedList })
                .eq('agentID', userID)
                .eq('date', selectedDate);

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
        }
        else {
            const { data, error } = await supabase
                .from('available_timeslot')
                .insert([{ agentID: userID, date: selectedDate, timeslot: checkedList }]);
            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
        }

        message.success('Timeslot saved successfully');
        setIsEdit(false);
        setIsCheckBoxDisabled(true);
        setIsEditBtnDisabled(false);
    }





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

                    <Checkbox.Group options={defaultOptions} value={checkedList} onChange={onChange} disabled={isCheckBoxDisabled} />

                    <Divider />
                    <Row>
                        <Col span={8}>
                            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} disabled={isCheckBoxDisabled}>
                                {isCheckedAll ? 'Uncheck all' : 'Check all'}
                            </Checkbox>
                        </Col>
                    </Row>
                </div>

                <div style={{ border: '1px solid blue', width: '100%', height: '300px' }}>

                    {isEdit ? <Row>
                        <Col span={8}>
                            <Button type="primary" onClick={saveTimeslot} >Save</Button>
                        </Col>
                       
                    </Row> : <Row>
                        <Col span={8}>
                            <Button type="primary" disabled={isEditBtnDisabled}  onClick={() => {
                                setIsEdit(true)
                                setIsCheckBoxDisabled(false);
                                }}>Edit</Button>
                        </Col>
                    </Row>}
                </div>
            </div>

            <div>
                {checkedList}
            </div>

        </div>


    </>
}

export default AgentAppointment;