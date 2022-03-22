import React from "react";
import { Table } from "react-bootstrap";

import { ChargeInfo, Charger } from "../getters/getChargers";

export const ChargerTable = ({ chargeInfos }: { chargeInfos?: ChargeInfo[] }) => {
    if (chargeInfos === undefined) return null;

    return (
        <Table striped bordered hover variant="dark">
            <tbody>
                {chargeInfos.map(({ chargeValue, chargers }) => (
                    <tr key={chargeValue} className="border border-white">
                        <td className="align-middle text-center">
                            <b className="sticky-top h1">{chargeValue}</b>
                        </td>
                        <td className="p-0">
                            {chargers.map((charger) => (
                                <a key={charger.id} href={`https://apps.atlasacademy.io/db/JP/servant/${charger.id}`}>
                                    <img
                                        src={charger.img}
                                        alt={charger.name}
                                        title={charger.name}
                                        width={142}
                                        height={155}
                                    />
                                </a>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};
