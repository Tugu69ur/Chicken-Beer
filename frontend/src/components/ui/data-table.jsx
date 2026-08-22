import React from 'react';
import { Table } from 'antd';

function DataTable({ columns, dataSource, loading = false, emptyText = 'No data found', rowKey = '_id', pagination = { pageSize: 10 }, className = '', onRow, ...props }) {
  const defaultColumns = columns.map((col) => {
    if (col.render && !col.align) {
      return { ...col, align: 'left' };
    }
    return col;
  });

  return (
    <div className={`card overflow-hidden ${className}`}>
      <Table
        columns={defaultColumns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          pageSize: pagination.pageSize || 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
          ...pagination,
        }}
        onRow={onRow}
        className="premium-table"
        {...props}
      />
    </div>
  );
}

export default DataTable;
