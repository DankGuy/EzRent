import { Fragment } from "react";
import { supabase } from "../../../supabase-client";
import { useState, useEffect } from "react";
import { Button, Table, Tooltip } from "antd";
import { convertDate } from "../../../Components/timeUtils";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef } from "react";
import { Link } from "react-router-dom";


function AgentRentedProperty() {

    const [properties, setProperties] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")
    const searchInput = useRef(null)



    useEffect(() => {

        const fetchProperties = async () => {
            const userID = (await supabase.auth.getUser()).data.user.id;

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
                    post: element,
                    rentalAgreementID: element.rentalAgreementID,
                    propertyName: element.postID.propertyName,
                    propertyAddress: address,
                    duration: rentalDuration(),
                    tenantName: element.studentID.name,
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

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText("")
        confirm()
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
                        onClick={() => handleReset(clearFilters, confirm)}
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
            title: "Rental Agreement ID",
            dataIndex: "rentalAgreementID",
            key: "rentalAgreementID",
            fixed: "left",
            ...getColumnSearchProps("rentalAgreementID", "Search Rental Agreement ID"),
            ellipsis: {
                showTitle: false,
            },
            className: "postIDcolumn",
        },
        {
            title: "Property Name",
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
            title: "Property Address",
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
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            sorter: (a, b) => a.duration.localeCompare(b.duration),
        },
        {
            title: "Tenant Name",
            dataIndex: "tenantName",
            key: "tenantName",
            sorter: (a, b) => a.tenantName.localeCompare(b.tenantName),
            ...getColumnSearchProps("tenantName", "Search Tenant Name"),
            ellipsis: {
                showTitle: false,
            },
            render: (tenantName, post) => (
                <Tooltip placement="topLeft" title={tenantName}>
                    <Link to={`/agent/rentedProperty/${tenantName}`} state={post} >
                        {tenantName}
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: "Commencement Date",
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