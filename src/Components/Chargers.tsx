import React from "react";
import { Table } from "react-bootstrap";

import { Charger } from "../getters/getChargers";

import "./Chargers.css";

interface IProps {
    chargers: { [key: number]: Charger[] };
    selfChargeSupport?: { [key: number]: Charger[] };
    partyChargers?: { [key: number]: Charger[] };
    allyChargers?: { [key: number]: Charger[] };
}
const Chargers = ({ chargers, partyChargers, selfChargeSupport, allyChargers }: IProps) => {
    if (!chargers) return null;
    if (partyChargers === undefined || selfChargeSupport === undefined || allyChargers === undefined) {
        const dictOfRows: { [key: string]: JSX.Element[] } = {};
        Object.keys(chargers).forEach((charge) => {
            const rowOfImages = getChargerRow(chargers[charge as any as number]);
            const splitRows = [];
            if (rowOfImages.length > 10) {
                for (let i = Math.floor(rowOfImages.length / 8); i > 0; i--) {
                    splitRows.push(rowOfImages.splice(0, Math.ceil(rowOfImages.length / i)));
                }
            } else {
                splitRows.push(rowOfImages);
            }
            dictOfRows[charge] = splitRows as any[];
        });
        return (
            <Table striped bordered hover variant="dark">
                <tbody>
                    {Object.keys(dictOfRows).map((charge) => (
                        <tr key={charge} className="border border-white">
                            <td className="align-middle text-center">
                                <b className="sticky-top h1">{charge}</b>
                            </td>
                            <td className="p-0">{dictOfRows[charge]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }
    const dictOfRowsParty: { [key: string]: JSX.Element[] } = {};
    const dictOfRowsAlly: { [key: string]: JSX.Element[] } = {};
    const dictOfRowsSelf: { [key: string]: JSX.Element[] } = {};

    Object.keys(partyChargers).forEach((charge) => {
        const rowOfImages = getChargerRow(partyChargers[charge as any as number]);
        const splitRows = [];
        if (rowOfImages.length > 10) {
            for (let i = Math.floor(rowOfImages.length / 8); i > 0; i--) {
                splitRows.push(rowOfImages.splice(0, Math.ceil(rowOfImages.length / i)));
            }
        } else {
            splitRows.push(rowOfImages);
        }
        dictOfRowsParty[charge] = splitRows as any[];
    });
    Object.keys(allyChargers).forEach((charge) => {
        const rowOfImages = getChargerRow(allyChargers[charge as any as number]);
        const splitRows = [];
        if (rowOfImages.length > 10) {
            for (let i = Math.floor(rowOfImages.length / 8); i > 0; i--) {
                splitRows.push(rowOfImages.splice(0, Math.ceil(rowOfImages.length / i)));
            }
        } else {
            splitRows.push(rowOfImages);
        }
        dictOfRowsAlly[charge] = splitRows as any[];
    });
    return (
        <>
            <Table striped bordered hover variant="dark">
                <tbody>
                    {Object.keys(dictOfRowsParty).map((charge) => (
                        <tr key={charge} className="border border-white">
                            <td className="align-middle text-center">
                                <b className="sticky-top h1">{charge}</b>
                            </td>
                            <td className="p-0">{dictOfRowsParty[charge]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Table striped bordered hover variant="dark">
                <tbody>
                    {Object.keys(dictOfRowsAlly).map((charge) => (
                        <tr key={charge} className="border border-white">
                            <td className="align-middle text-center">
                                <b className="sticky-top h1">{charge}</b>
                            </td>
                            <td className="p-0">{dictOfRowsAlly[charge]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

const getChargerRow = (chargers: Charger[]) => {
    const rows = chargers.map((charger) => {
        return (
            <a key={charger.id} href={`https://apps.atlasacademy.io/db/JP/servant/${charger.id}`}>
                <img src={charger.img} alt={charger.name} title={charger.name} />
            </a>
        );
    });
    return rows;
};

export default Chargers;
