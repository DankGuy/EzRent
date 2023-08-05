import {
    Breadcrumb,
    Descriptions,
    Form,
    Input,
    Row,
    Col,
    Select,
    Slider,
    Radio,
    DatePicker,
    Typography,
    Button,
    Popconfirm,
    message,
    InputNumber,
} from "antd"
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"
import moment from 'moment';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { getCurrentDateTime } from "../../../Components/timeUtils";


const { Title } = Typography;


function ListingPostDetails() {

    const location = useLocation();
    const { listing, isView } = location.state;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const propertyDetailsRef = useRef(null);
    const rentalDetailsRef = useRef(null);
    const roommatePreferencesRef = useRef(null);
    const myLifestyleRef = useRef(null);


    console.log(listing);
    console.log(isView);

    useEffect(() => {
        form.setFieldsValue({
            moveInDate: moment(listing.moveInDate),
            rentDuration: listing.duration,
            locationSelection: listing.location,
            propertySelection: listing.propertyType,
            budgetInput: listing.budget,
            preferredAge: [listing.roommate.age[0], listing.roommate.age[1]],
            preferredGender: listing.roommate.gender,
            studentType: listing.roommate.studentType,
            preferredRace: listing.roommate.race,
            preferredReligion: listing.roommate.religion,
            description: listing.roommate.description,
            cleanliness: listing.myLifestyle.cleanliness,
            smoking: listing.myLifestyle.smoking,
            getUp: listing.myLifestyle.getUp,
            goToBed: listing.myLifestyle.goToBed,
            pets: listing.myLifestyle.pets,
            foodPreference: listing.myLifestyle.foodPreference,
            guests: listing.myLifestyle.guests,
            party: listing.myLifestyle.party,
        })
    }, [form, listing])

    const descriptionLabelStyle = {
        color: 'black',
    }

    const descriptionContentStyle = {
        color: 'black',
        border: '1px solid #d9d9d9',
        borderRadius: '5px',
        padding: '4px 11px',
    }

    const fieldsetStyle = {
        border: '1px solid #d9d9d9',
        borderRadius: '5px',
        padding: '10px',
        marginTop: '20px',
    }

    const legendStyle = {
        width: 'auto',
        borderBottom: 'none',
        marginLeft: '20px',
        marginBottom: '0px',
    }

    const handleButtonCancel = () => {
        navigate(-1);
    }

    const deletePost = async () => {
        const { error } = await supabase
            .from('roommate_post')
            .delete()
            .eq('postID', listing.postID);

        if (error) {
            console.log(error);
            return;
        }

        messageApi.open({
            type: 'success',
            content: 'Delete successful. You will be redirected to previous page within 3 seconds...',
        });

        setTimeout(() => {
            navigate("/student/roommate/myListings")
        }, 3000);
    }

    const showButton = () => {
        if (isView) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', marginTop: '20px' }}>
                    <Link to={`/student/roommate/myListings/${listing.postID}`} state={{ listing, isView: false }}>
                        <Button className='viewButton' style={{ marginRight: '20px', width: '100px' }} type="primary" >
                            Edit
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure you want to delete this post?"
                        onConfirm={() => {
                            deletePost();
                        }}
                    >
                        {contextHolder}
                        <Button className="viewButton" style={{ width: '100px' }} type="primary">
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
        else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', marginTop: '20px' }}>
                    <Button className='viewButton' style={{ marginRight: '20px', width: '100px' }} type="primary" onClick={handleButtonCancel}>
                        Cancel
                    </Button>

                    <Popconfirm
                        title="Title"
                        description="Are you sure you want to make changes?"
                        onConfirm={() => {
                            form.submit();
                        }}
                    >
                        {contextHolder}
                        <Button className="viewButton" style={{ width: '100px' }} type="primary">
                            Edit
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    }

    const onFinish = async (values) => {
        console.log(values);

        const currentDate = getCurrentDateTime();

        const { error } = await supabase
            .from('roommate_post')
            .update({
                location: values.locationSelection,
                propertyType: values.propertySelection,
                budget: values.budgetInput,
                moveInDate: values.moveInDate,
                duration: values.rentDuration,
                roommate: {
                    age: values.preferredAge,
                    gender: values.preferredGender,
                    studentType: values.studentType,
                    race: values.preferredRace,
                    religion: values.preferredReligion,
                    description: values.description,
                },
                myLifestyle: {
                    cleanliness: values.cleanliness,
                    smoking: values.smoking,
                    getUp: values.getUp,
                    goToBed: values.goToBed,
                    pets: values.pets,
                    foodPreference: values.foodPreference,
                    guests: values.guests,
                    party: values.party,
                },
                lastModifiedDate: currentDate,
            })
            .eq('postID', listing.postID);

        if (error) {
            console.log(error);
            return;
        }

        messageApi.loading('Editing post...', 3);
        setTimeout(() => {
            messageApi.success('Edit successful. You will be redirected to the previous page within 1 second...', 1);

            setTimeout(() => {
                navigate("/student/roommate/myListings");
            }, 1000);
        }, 3000);
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    const handleClick = (sec) => () => {
        const offset = -50; // Adjust this value to set the desired offset from the top of the element

        let targetRef;

        if (sec === 1) {
            targetRef = propertyDetailsRef;
        } else if (sec === 2) {
            targetRef = rentalDetailsRef;
        } else if (sec === 3) {
            targetRef = roommatePreferencesRef;
        } else if (sec === 4) {
            targetRef = myLifestyleRef;
        }

        if (targetRef && targetRef.current) {
            const elementPosition = targetRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset + offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };



    return (
        <div
            style={{
                margin: "10px 1% 10px 1%",
                padding: "0em 2em 1em 2em",
            }}>
            <div style={{ width: '50%', marginLeft: '1%' }}>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                    items={[
                        { href: '/student', title: 'Home' },
                        { href: '/student/roommate', title: 'Roommate' },
                        { href: '/student/roommate/myListings', title: 'My Listings' },
                        { title: 'Listing Details' },
                    ]}
                />

            </div>
            <div
                style={{
                    backgroundColor: "white",
                    margin: "0px 1% 0px 1%",
                    width: '60%',
                    padding: '20px',
                    boxShadow: '0 -1px 1px 0 rgba(0, 28, 36, .3), 0 1px 1px 0 rgba(0, 28, 36, .3), 1px 1px 1px 0 rgba(0, 28, 36, .15), -1px 1px 1px 0 rgba(0, 28, 36, .15)',
                }}>
                {isView ? (
                    <Title level={2} style={{ textAlign: 'center' }}>Listing Details</Title>
                ) : (
                    <Title level={2} style={{ textAlign: 'center' }}>Edit Listing</Title>
                )}
                <Form
                    layout="vertical"
                    size="middle"
                    disabled={isView}
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <fieldset style={fieldsetStyle} ref={propertyDetailsRef}>
                        <legend style={legendStyle}>Property Details</legend>
                        <Descriptions
                            layout="vertical"
                            labelStyle={descriptionLabelStyle}
                            contentStyle={descriptionContentStyle}
                            colon={false}
                            className="postDetails"
                        >
                            {listing.rentalAgreementID !== null && listing.rental_agreement && (
                                <>
                                    <Descriptions.Item label="Rental Agreement ID">{listing.rentalAgreementID}</Descriptions.Item>
                                    <Descriptions.Item label="Property Name" span={2}>{listing.rental_agreement.postID.propertyName}</Descriptions.Item>
                                    <Descriptions.Item label="Property Address">{listing.rental_agreement.postID.propertyAddress}</Descriptions.Item>
                                </>
                            )}

                        </Descriptions>

                        {listing.rentalAgreementID === null && (
                            <>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item name="locationSelection" label="Preferred Location">
                                            <Input placeholder="Location" style={{ width: '80%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="propertySelection" label="Property Type">
                                            <Select placeholder="Select" style={{ width: '50%' }}
                                                options={[
                                                    { value: 'Apartment', label: 'Apartment' },
                                                    { value: 'Condominium', label: 'Condominium' },
                                                    { value: 'Flat', label: 'Flat' },
                                                    { value: 'Terrace house', label: 'Terrace house' },
                                                ]} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item name="budgetInput" label="Budget (RM)">
                                            <InputNumber placeholder="Budget" style={{ width: '50%' }} min={0} />
                                        </Form.Item>

                                    </Col>
                                </Row>
                                {/* <Descriptions.Item label="Preferred Location">{listing.location}</Descriptions.Item>
                                    <Descriptions.Item label="Preferred Property Type">{listing.propertyType}</Descriptions.Item>
                                    <Descriptions.Item label="Preferred Budget">RM{listing.budget}.00/month</Descriptions.Item> */}
                            </>
                        )}
                    </fieldset>
                    <fieldset style={fieldsetStyle} ref={rentalDetailsRef}>
                        <legend style={legendStyle}>Rental Details</legend>
                        <Form.Item name="moveInDate" label="Move-in Date">
                            <DatePicker placeholder="Select" />
                        </Form.Item>
                        <Form.Item name="rentDuration" label="Rent Duration">
                            <Select placeholder="Select" style={{ width: '21%' }}
                                options={[
                                    { value: '3 months', label: '3 months' },
                                    { value: '6 months', label: '6 months' },
                                    { value: '12 months', label: '12 months' },
                                    { value: '24 months', label: '24 months' }
                                ]} />
                        </Form.Item>
                    </fieldset>
                    <fieldset style={fieldsetStyle} ref={roommatePreferencesRef}>
                        <legend style={legendStyle}>Roommate Preferences</legend>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="preferredAge" label="Age">
                                    <Slider range step={3} min={1} max={60} style={{ margin: '10px' }} disabled={isView} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="preferredGender" label="Gender">
                                    <Radio.Group>
                                        <Radio value="male">Male</Radio>
                                        <Radio value="female">Female</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="studentType" label="Student Type">
                                    <Radio.Group>
                                        <Radio value="local">Local</Radio>
                                        <Radio value="international">International</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="preferredRace" label="Race">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Malay', label: 'Malay' },
                                            { value: 'Chinese', label: 'Chinese' },
                                            { value: 'Indian', label: 'Indian' },
                                            { value: 'Others', label: 'Others' }
                                        ]} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="preferredReligion" label="Religion">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Islam', label: 'Islam' },
                                            { value: 'Buddhism', label: 'Buddhism' },
                                            { value: 'Christianity', label: 'Christianity' },
                                            { value: 'Hinduism', label: 'Hinduism' },
                                            { value: 'Others', label: 'Others' }
                                        ]} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea placeholder="Description" style={{ height: 100 }} />
                        </Form.Item>
                    </fieldset>
                    <fieldset style={fieldsetStyle} ref={myLifestyleRef}>
                        <legend style={legendStyle}>My Lifestyle</legend>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="cleanliness" label="My Cleanliness">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Clean', label: 'Clean' },
                                            { value: 'Average', label: 'Average' },
                                            { value: 'Messy', label: 'Messy' },
                                        ]} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="smoking" label="Smoking">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Yes', label: 'Yes' },
                                            { value: 'No', label: 'No' },
                                            { value: 'Outside only', label: 'Outside only' },
                                        ]} />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="getUp" label="Get up">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Before 6am', label: 'Before 6am' },
                                            { value: 'Before 8am', label: 'Before 8am' },
                                            { value: 'Before 10am', label: 'Before 10am' },
                                            { value: 'After 10am', label: 'After 10am' },
                                            { value: 'After 12am', label: 'After 12am' },
                                        ]} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="goToBed" label="Go to bed">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Before 10pm', label: 'Before 10pm' },
                                            { value: 'Before 12am', label: 'Before 12am' },
                                            { value: 'After 12am', label: 'After 12am' },
                                        ]} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="pets" label="Pets">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Yes', label: 'Yes' },
                                            { value: 'No', label: 'No' },
                                        ]} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="foodPreference" label="Food Preference">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Vegetarian', label: 'Vegetarian' },
                                            { value: 'Non-vegetarian', label: 'Non-vegetarian' },
                                            { value: 'Halal', label: 'Halal' },
                                            { value: 'Non-halal', label: 'Non-halal' },
                                        ]} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="guests" label="Overnight Guests">
                                    <Select placeholder="Select" style={{ width: '50%' }}

                                        options={[
                                            { value: 'Never', label: 'Never' },
                                            { value: 'Rarely', label: 'Rarely' },
                                            { value: 'Occasionally', label: 'Occasionally' },
                                            { value: 'Frequently', label: 'Frequently' },
                                        ]} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="party" label="Party Habits">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Rarely', label: 'Rarely' },
                                            { value: 'Occasionally', label: 'Occasionally' },
                                            { value: 'Frequently', label: 'Frequently' },
                                        ]} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </fieldset>

                </Form>
                {showButton()}

            </div>

            <div
                style={{
                    position: 'fixed',
                    top: '115px',
                    right: '300px',
                    height: 'auto',
                    width: '200px',
                    backgroundColor: 'white',
                    padding: '10px',
                    boxShadow: '0 -1px 1px 0 rgba(0, 28, 36, .3), 0 1px 1px 0 rgba(0, 28, 36, .3), 1px 1px 1px 0 rgba(0, 28, 36, .15), -1px 1px 1px 0 rgba(0, 28, 36, .15)',

                }}>
                <Row>
                    <Col span={24} style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        On this page:
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <a onClick={handleClick(1)}>Property Details</a>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <a onClick={handleClick(2)}>Rental Details</a>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <a onClick={handleClick(3)}>Roommate Preferences</a>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <a onClick={handleClick(4)}>My Lifestyle</a>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ListingPostDetails