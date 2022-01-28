import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';

// Create an editable cell renderer
const EditableCell = ({
                          value: initialValue,
                          row: { index },
                          column: { id },
                          updateMyData, // This is a custom function that we supplied to our table instance
                      }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <input className="edit-table-input" value={value} onChange={onChange} onBlur={onBlur} />
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
    Cell: EditableCell,
}

// Be sure to pass our updateMyData option
export default function EditTable({ columns, data, updateMyData }) {

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns,
            data,
            defaultColumn,
            updateMyData,
        }
    );

    // Render the UI for your table
    return (
        <table {...getTableProps()} border="1" className="table">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps({
                            style: { width: column.width },
                        })}>{column.render("Header")}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr key={row.id} {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps({
                                style: {width: cell.column.cellWidth}
                            })}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
}