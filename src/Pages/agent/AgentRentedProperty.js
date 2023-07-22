import { Fragment } from "react";
import { supabase } from "../../supabase-client";
import { useState, useEffect } from "react";
import { Button, Table, Tooltip } from "antd";
import { convertDate } from "../../Components/timeUtils";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef } from "react";


function AgentRentedProperty() {

    const [properties, setProperties] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")
    const searchInput = useRef(null)



    useEffect(() => {

        const fetchProperties = async () => {
            const userID = (await supabase.auth.getUser()).data.user.id;
            console.log(userID)

            const { data, error } = await supabase
                .from("rental_agreement")
                .select("* , postID(*), studentID(*), agentID(*)")
                .eq("agentID", userID)

            const tableData = [];
           
            data.forEach((element) => {

                const rentalDuration = () => {
                    if (element.rentalDuration.year === 0) {
                        return element.rentalDuration.month + ' month(s)'
                    } else if (element.rentalDuration.month === 0) {
                        return element.rentalDuration.year + ' year(s)'
                    } else {
                        return element.rentalDuration.year + ' year(s) ' + element.rentalDuration.month + ' month(s)'
                    }
                }

                //combine address, postcode, city, state into one string
                const address = element.postID.propertyAddress + ', ' + element.postID.propertyPostcode + ' ' + element.postID.propertyCity + ', ' + element.postID.propertyState

                tableData.push({
                    key: element.rentalAgreementID,
                    postID: element.postID.postID,
                    propertyName: element.postID.propertyName,
                    propertyAddress: address,
                    rentalPrice: element.rentalPrice,
                    duration: rentalDuration(),
                    studentName: element.studentID.name,
                    commencementDate: element.commencementDate,
                });
            });

            setProperties(tableData)
        }

        fetchProperties()
    }, [])

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("")
    }

    const getColumnSearchProps = (dataIndex, placeholder) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} 
                onKeyDown={(e) => {
                    e.stopPropagation();
                }
            }>
                <Input
                    ref={searchInput}
                    placeholder={placeholder}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />

                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}   
                    >
                        Search
                    </Button>

                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >

                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "black" : undefined }} />
        ),
        onFilter: (value, record) => {
            return record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : ""
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100)
            }
        },
        render: (text) =>

            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    })




    const columns = [
        {
            title: "Post ID" ,
            dataIndex: "postID",
            key: "postID",
            fixed: "left",
            ...getColumnSearchProps("postID", "Search Post ID"),
            ellipsis: {
                showTitle: false,
            },
            render: (postID) => (
                <Tooltip placement="topLeft" title={postID}>
                    {postID}
                </Tooltip>
            ),
            className: "postIDcolumn", 
        },
        {
            title: "Property Name" ,
            dataIndex: "propertyName",
            key: "propertyName",
            ...getColumnSearchProps("propertyName", "Search Property Name"),
            sorter: (a, b) => a.propertyName.localeCompare(b.propertyName),
            ellipsis: {
                showTitle: false,
            },
            render: (propertyName) => (
                <Tooltip placement="topLeft" title={propertyName}>
                    {propertyName}
                </Tooltip>
            ),
        },
        {
            title: "Property Address" ,
            dataIndex: "propertyAddress",
            key: "propertyAddress",
            sorter: (a, b) => a.propertyAddress.localeCompare(b.propertyAddress),
            ellipsis: {
                showTitle: false,
            },
            render: (address) => (
                <Tooltip placement="topLeft" title={address}>
                    {address}
                </Tooltip>
            ),
            
        }
        ,
        {
            title: "Rental Price" ,
            dataIndex: "rentalPrice",
            key: "rentalPrice",
            sorter: (a, b) => a.rentalPrice - b.rentalPrice,
            render: (rentalPrice) => (
                <p>RM {rentalPrice}.00</p>
            ),
        },
        {
            title: "Duration" ,
            dataIndex: "duration",
            key: "duration",
            sorter: (a, b) => a.duration.localeCompare(b.duration),
        },
        {
            title: "Student Name" ,
            dataIndex: "studentName",
            key: "studentName",
            sorter: (a, b) => a.studentName.localeCompare(b.studentName),
            ...getColumnSearchProps("studentName", "Search Student Name"),
            ellipsis: {
                showTitle: false,
            },
            render: (studentName) => (
                <Tooltip placement="topLeft" title={studentName}>
                    {studentName}
                </Tooltip>
            ),
        },
        {
            title: "Commencement Date" ,
            dataIndex: "commencementDate",
            key: "commencementDate",
            sorter: (a, b) => a.commencementDate.localeCompare(b.commencementDate),
            render: (commencementDate) => (
                <p>{convertDate(commencementDate)}</p>
            ),
            width: '15%',
        },
    ]



    return (
        <Fragment>
        <div>
            <h1>Rented Property</h1>
        </div>
        <Table 
            columns={columns}
            dataSource={properties}
            bordered={true}
            pagination={{ pageSize: 20, position: ['bottomCenter'] }}
            scroll={{ x: 1300, y: 300 }}
            tableLayout="fixed"
            className="propertyTable"
        />
        </Fragment>
    );
}

export default AgentRentedProperty;