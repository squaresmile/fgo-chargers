import React from "react";
import { Table } from "react-bootstrap";

import { ChargeInfo, Charger } from "../getters/getChargers";

interface IProps {
    selfChargers?: ChargeInfo[];
    selfChargeSupport?: ChargeInfo[];
    partyChargers?: ChargeInfo[];
    allyChargers?: ChargeInfo[];
}

const Chargers = ({ selfChargers, partyChargers, selfChargeSupport, allyChargers }: IProps) => {
    if (
        selfChargers === undefined &&
        partyChargers === undefined &&
        selfChargeSupport === undefined &&
        allyChargers === undefined
    )
        return null;

    if (
        selfChargers !== undefined &&
        partyChargers === undefined &&
        selfChargeSupport === undefined &&
        allyChargers === undefined
    ) {
        const dictOfRows: { [key: string]: JSX.Element[] } = {};
        for (const { chargeValue, chargers } of selfChargers) {
            const rowOfImages = getChargerRow(chargers);
            const splitRows = [];
            if (rowOfImages.length > 10) {
                for (let i = Math.floor(rowOfImages.length / 8); i > 0; i--) {
                    splitRows.push(rowOfImages.splice(0, Math.ceil(rowOfImages.length / i)));
                }
            } else {
                splitRows.push(rowOfImages);
            }
            dictOfRows[chargeValue] = splitRows as any[];
        }
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

    if (partyChargers !== undefined) {
        for (const { chargeValue, chargers } of partyChargers) {
            const rowOfImages = getChargerRow(chargers);
            const splitRows = [];
            if (rowOfImages.length > 10) {
                for (let i = Math.floor(rowOfImages.length / 8); i > 0; i--) {
                    splitRows.push(rowOfImages.splice(0, Math.ceil(rowOfImages.length / i)));
                }
            } else {
                splitRows.push(rowOfImages);
            }
            dictOfRowsParty[chargeValue] = splitRows as any[];
        }
    }

    if (allyChargers !== undefined) {
        for (const { chargeValue, chargers } of allyChargers) {
            const rowOfImages = getChargerRow(chargers);
            const splitRows = [];
            if (rowOfImages.length > 10) {
                for (let i = Math.floor(rowOfImages.length / 8); i > 0; i--) {
                    splitRows.push(rowOfImages.splice(0, Math.ceil(rowOfImages.length / i)));
                }
            } else {
                splitRows.push(rowOfImages);
            }
            dictOfRowsAlly[chargeValue] = splitRows as any[];
        }
    }

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
                <img src={charger.img} alt={charger.name} title={charger.name} width={142} height={155} />
            </a>
        );
    });
    return rows;
};

export default Chargers;
