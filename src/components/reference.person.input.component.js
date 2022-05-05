import React, {useEffect, useMemo, useState} from "react";
import Table from "./table.component";
import CreateReferencePerson from "./reference.person.create.component";
import Trash from "../icons/trash.svg";
import moment from "moment";

import '../style/table.input.component.css';

export default function ReferencePerson({callback, data, disabled}) {
    //TODO dann hier "data" verarbeiten
    const [tableData, setTableData] = useState([]);
    const [toggle, setToggle] = useState(false);

    const activateToggle = () => {
        setToggle(true);
    }

    const deactivateToggle = () => {
        setToggle(false);
    }

    const onDeleteClick = (e) => {
        let newData = [];
        tableData.map(p => {
            if (String(p.internal_id) !== String(e.target.value)) {
                newData.push(p)
            }
        });
        setTableData(newData);
        sendInputToParent(newData);
    }

    const columns = useMemo(
        () => [
            {
                width: 20,
                Header: "Interne-ID",
                accessor: "internal_id",
            },
            {
                width: 200,
                Header: "Typ",
                accessor: "type",
            },
            {
                width: 200,
                Header: "Name",
                accessor: "name",
            },
            {
                width: 150,
                Header: "Geburtsdatum",
                accessor: "birthday",
                Cell: ({ value }) => {
                    if (value !== undefined && value !== "") {
                        let formatedDate = moment(value).format("DD.MM.YYYY")
                        return String(formatedDate);
                    } else {
                        return "";
                    }
                },
            },
            {
                width: 300,
                Header: 'Straße',
                accessor: 'address.street',
            },
            {
                width: 100,
                Header: 'Nr',
                accessor: 'address.number',
            },
            {
                width: 100,
                Header: 'PLZ',
                accessor: 'address.zipCode',
            },
            {
                width: 150,
                Header: 'Stadt',
                accessor: 'address.city',
            },
            {
                //default editable cell
                width: 200,
                Header: "Telefon",
                accessor: "phone",
            },
            {
                //default editable cell
                width: 300,
                Header: "E-Mail",
                accessor: "email",
            },
            {
                width: 80,
                Header: "Aktion",
                accessor: "action",
                Cell: ({ value, row }) => (
                    <input className="table-input-cell"
                           style={{height: 25, width: 25}}
                           type="image"
                           value={row.values.internal_id}
                           src={Trash}
                           alt="löschen"
                           onClick={onDeleteClick}
                    />
                ),
            }
        ],
        [onDeleteClick]
    )

    const tData = useMemo(() => tableData, [tableData]);

    const addInputToReferencePersons = (input) => {
        let temp_data = [...tableData];
        let temp_obj = input;
        temp_obj.internal_id = findNextFreeId(temp_data);
        temp_data.push(temp_obj);
        setTableData(temp_data);
        sendInputToParent(temp_data);
    }

    const findNextFreeId = (temp_data) => {
        let isFree = true;
        let i = 0;
        do {
            i += 1;
            isFree = true;

            temp_data.map(p => {
                let include = String(p.internal_id) === String(i);
                if (include) {
                    isFree = false;
                }
            });
        } while (!isFree)

        return i;
    }

    const sendInputToParent = (input) => {
        callback(input);
    }

    return(
        <div className="table-input-container" aria-readonly={disabled}>
            <div className="table-input-toggle-row">
                {!toggle && <button className="table-input-toggle-button" type="button" onClick={activateToggle}>Bezugspersonen anzeigen</button>}
                {toggle && <button className="table-input-toggle-button" type="button" onClick={deactivateToggle}>Einklappen</button>}
            </div>

            {toggle &&
                <div>
                    <div className="table-input-title">
                        <h1><u>Bezugspersonen</u></h1>
                    </div>

                    <Table columns={columns} data={tData}/>

                    {!disabled &&
                        <div>
                            <div className="table-input-title">
                                <h2><u>Bezugspersonen hinzufügen</u></h2>
                            </div>
                            <CreateReferencePerson callback={addInputToReferencePersons}/>
                        </div>
                    }
                </div>
            }
        </div>
    );
}