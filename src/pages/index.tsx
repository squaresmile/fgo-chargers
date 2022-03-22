import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";

import { ChargerTable } from "../Components/Chargers";
import getChargers, { CategorizedChargeInfo } from "../getters/getChargers";

import "bootstrap/dist/css/bootstrap.min.css";

export const getStaticProps: GetStaticProps = async (context) => {
    return { props: await getChargers() };
};

const App = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const { chargers, selfChargeAOE, selfChargeST, selfChargeSupport, partyCharge, allyCharge }: CategorizedChargeInfo =
        props.pageProps;
    if (chargers === undefined) return null;

    return (
        <>
            <Head>
                <link rel="icon" href="./npbattery.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="NP Gauge Chargers - Fate/Grand Order" />
                <link rel="apple-touch-icon" href="./npbattery.ico" />
                <link rel="manifest" href="./manifest.json" />
                <title>FGO NP Chargers</title>
            </Head>
            <Tabs id="charger-tabs">
                <Tab title="Self Charge AOE" eventKey="self-charge-aoe">
                    <ChargerTable chargeInfos={selfChargeAOE} />
                </Tab>
                <Tab title="Self Charge ST" eventKey="self-charge-st">
                    <ChargerTable chargeInfos={selfChargeST} />
                </Tab>
                <Tab title="Targeted &amp; Party Chargers" eventKey="targeted-party-chargers">
                    <ChargerTable chargeInfos={partyCharge} />
                    <ChargerTable chargeInfos={allyCharge} />
                </Tab>
            </Tabs>
        </>
    );
};

export default App;
