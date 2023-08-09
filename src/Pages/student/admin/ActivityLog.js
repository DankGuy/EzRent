import React, { useState, useRef } from "react";
import { Table, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useEffect } from "react";
import { supabase } from "../../../supabase-client";

function ActivityLog() {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const fetchData = async () => {
        let { data: activity_log, error } = await supabase
            .from('activity_log')
            .select('*');

        if (error) {
            console.log('error', error);
        } else {
            const newData = await Promise.all(activity_log.map(async (log, index) => {
                let adminName, category;

                let { data: admin, adminError } = await supabase
                    .from('student')
                    .select('name')
                    .eq('student_id', log.managed_by);

                if (adminError) {
                    console.log('adminError', adminError);
                } else {
                    adminName = admin[0]?.name || '';
                }

                let { data: post, postError } = await supabase
                    .from('property_post')
                    .select('*')
                    .eq('postID', log.target);

                if (!postError && post.length > 0) {
                    category = 'post';
                }

                let { data: report, reportError } = await supabase
                    .from('report')
                    .select('*')
                    .eq('reportID', log.target);

                if (!reportError && report.length > 0) {
                    category = 'report';
                }

                let { data: account, accountError } = await supabase
                    .from('agent')
                    .select('*')
                    .eq('agent_id', log.target);

                if (!accountError && account.length > 0) {
                    category = 'account';
                }

                return {
                    key: index,
                    managed_by: adminName,
                    action: log.action,
                    category: category,
                    target: log.target,
                    date: log.date,
                };
            }));
            setData(newData);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Managed By',
            dataIndex: 'managed_by',
            key: 'managed_by',
            ...getColumnSearchProps('managed_by'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            filters: [
                {
                    text: 'Approve Post',
                    value: 'approve_post',
                },
                {
                    text: 'Reject Post',
                    value: 'reject_post',
                },
                {
                    text: 'Resolve Report',
                    value: 'resolve_report',
                },
                {
                    text: 'Deactivate Post',
                    value: 'deactivate_post',
                },
                {
                    text: 'Deactivate Account',
                    value: 'deactivate_account'
                },
            ],
            onFilter: (value, record) => record.action.indexOf(value) === 0,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            filters: [
                {
                    text: 'Post',
                    value: 'post',
                },
                {
                    text: 'Report',
                    value: 'report',
                },
                {
                    text: 'Account',
                    value: 'account',
                },
            ],
            onFilter: (value, record) => record.category.indexOf(value) === 0,
        },
        {
            title: 'Target',
            dataIndex: 'target',
            key: 'target',
            ...getColumnSearchProps('target'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            sortDirections: ['descend', 'ascend'],
        }
    ]


    return (
        <div>
            <Table columns={columns} dataSource={data} bordered />
        </div>
    )
}
export default ActivityLog;