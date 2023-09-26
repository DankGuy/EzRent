import { Modal, Form, Input, Select, Button, message } from "antd";
import { useState } from 'react';
import { supabase } from '../supabase-client';

function ReportModalForm({ buttonContent, postID }) {


    const [form] = Form.useForm();

    const { TextArea } = Input;

    const [open, setOpen] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setOpen(true);
    };

    const handleSubmit = (e) => {
        console.log(e)
        // setOpen(false)
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const onFinish = async (e) => {
        console.log(e);
        messageApi.open({
            type: 'success',
            content: 'Successfully reported the post',
        });

        const { reportDescription, reportReason } = e;

        const userID = (await supabase.auth.getUser()).data.user.id;

        
        const {data, error } =await supabase
            .from('report')
            .insert([
                {
                    reportReason: reportReason ,
                    reportDescription: reportDescription ,
                    reportedBy: userID,
                    postID: postID,
                    reportStatus: 'Pending',
                    reportedDate: new Date(),
                },
            ]);
        
            console.log(data);
            console.log(error);

        form.resetFields();
        setOpen(false)
    }
    const onFinishFailed = (e) => {
        console.log('Failed:', e);
        setOpen(true)
    }

    return (
        <>
            <Button 
                onClick={showModal} 
                type="primary" 
                style={{ width: '100%', margin: '0px' }}
                className="viewButton">{buttonContent}</Button>

            <Modal
                open={open}
                title="Report an issue?"
                footer={null}
                onCancel={handleCancel}


            >
                <Form
                    form={form}
                    initialValues={{
                        reportReason: null,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ flex: '1' }}>
                            <Form.Item name="reportReason" rules={[{ required: true, message: 'Please choose at least one reason' }]}>
                                <Select
                                    style={{ width: '80%' }}
                                    options={[
                                        { value: null, label: 'Choose a report reason' },
                                        { value: 'Incorrect or inaccurate information', label: 'Incorrect or inaccurate information' },
                                        { value: 'Unresponsive or suspicious poster', label: 'Unresponsive or suspicious poster' },
                                        { value: 'Safety and security concerns', label: 'Safety and security concerns' },
                                        { value: 'Discriminatory or offensive content', label: 'Discriminatory or offensive content' },
                                        { value: 'Other issues', label: 'Other issues' },
                                    ]}

                                />
                            </Form.Item>

                            <Form.Item name="reportDescription" initialValue='' rules={[{ required: true, message: 'Please describe your problem here so that we can help you' }]}>
                                <TextArea style={{resize: 'none', height: 120}}  showCount maxLength={200} placeholder='Please describe your problem here...' />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                            <Form.Item>
                                <Button htmlType='reset' onClick={handleCancel} className='viewButton' style={{marginRight: '20px'}} type="primary" >
                                    Cancel
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                {contextHolder}
                                <Button htmlType='submit' onClick={handleSubmit} className="viewButton" type="primary">
                                    Submit
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default ReportModalForm;