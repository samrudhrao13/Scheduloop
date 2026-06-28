import React from 'react';

const Table = ({ columns, data, onRowClick }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                            No data available
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.render ? column.render(row) : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default Table;