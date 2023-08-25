import React from "react";
import { Table } from 'antd';

function UserActivation() {
    const columns = [
        {
            title: 'Agent ID',
            dataIndex: 'agentID',
        },
        {
            title: 'Agent Name',
            dataIndex: 'agentName',
            sorter: (a, b) => a.agentName - b.agentName,
        },
        {
            title: 'Report Reason',
            dataIndex: 'reportReason',
            filters: [
                {
                    text: 'London',
                    value: 'London',
                },
                {
                    text: 'New York',
                    value: 'New York',
                },
            ],
            onFilter: (value, record) => record.address.indexOf(value) === 0,
        },
    ];

    const data = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sydney No. 1 Lake Park',
        },
        {
          key: '4',
          name: 'Jim Red',
          age: 32,
          address: 'London No. 2 Lake Park',
        },
      ];

    return (
        <div>
            <Table columns={columns} dataSource={data} bordered />;
        </div>
    );
}

export default UserActivation;