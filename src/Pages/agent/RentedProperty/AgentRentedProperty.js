import { Fragment } from "react";
import { supabase } from "../../../supabase-client";
import { useState, useEffect } from "react";
import { Button, Table, Tooltip } from "antd";
import { convertDate } from "../../../Components/timeUtils";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef } from "react";
import RentedPropertyDetails from "./RentedPropertyDetails";


function AgentRentedProperty() {

    const [properties, setProperties] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")
    const searchInput = useRef(null)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTenant, setModalTenant] = useState([]);
    const [modalOccupant, setModalOccupant] = useState([]);



    useEffect(() => {

        const fetchProperties = async () => {
            const userID = (await supabase.auth.getUser()).data.user.id;

            const { data, error } = await supabase
                .from("rental_agreement")
                .select("* , postID(*), studentID(*), agentID(*)")
                .eq("agentID", userID)

            const tableData = [];

            data.forEach((element) => {

                console.log(element);

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
                    student: element.studentID,
                    occupant: element.occupantID,
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


    const handleModalChange = (record) => {
        console.log(record)

        setModalTenant(record.student);
        setModalOccupant(record.occupant);

        setIsModalOpen(true);
    }

    const onChangeModal = (value) => {
        setIsModalOpen(value);
    }

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
            width: '15%',
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
            width: '15%',
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
            width: '20%',

        }
        ,
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            sorter: (a, b) => a.duration.localeCompare(b.duration),
            width: '15%',
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
            render: (tenantName, record) => (
                <>
                    {/* <Tooltip placement="topLeft" title={tenantName}> */}
                    <div
                        onClick={() => handleModalChange(record)}
                        style={{ cursor: 'pointer', color: '#1890ff' }}>
                        {tenantName}
                    </div>
                    {/* </Tooltip> */}

                </>
            ),
            width: '15%',
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
                pagination={{ pageSize: 5, position: ['bottomCenter'] }}
                // tableLayout="fixed"
                className="propertyTable"
                scroll={{ x: 1300 }}
            />

            <RentedPropertyDetails
                value={isModalOpen}
                onChange={onChangeModal}
                occupantsID={modalOccupant}
                tenant={modalTenant} />
        </Fragment>
    );
}

export default AgentRentedProperty;