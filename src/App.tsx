import React from "react";
import { Tab, Tabs } from "react-bootstrap";

import Chargers from "./Components/Chargers";
import getChargers, { Charger } from "./getters/getChargers";

import "./App.css";

interface IState {
    chargers: Charger[];
    selfChargeAOE: { [key: number]: Charger[] };
    selfChargeST: { [key: number]: Charger[] };
    selfChargeSupport: { [key: number]: Charger[] };
    partyCharge: { [key: number]: Charger[] };
    allyCharge: { [key: number]: Charger[] };
    loading: boolean;
}

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            chargers: [],
            selfChargeAOE: {},
            selfChargeST: {},
            selfChargeSupport: {},
            partyCharge: {},
            allyCharge: {},
            loading: true,
        };
    }
    componentDidMount() {
        getChargers()
            .then(async (chargers) => this.setState({ chargers }))
            .then(() => this.updateSelfChargers())
            .then(() => this.updateSupportChargers());
    }
    updateSelfChargers() {
        const chargers = this.state.chargers.filter((charger) =>
            charger.charges!.some((charge) => charge.type === "self")
        );

        const selfChargeAOE: { [key: string]: Charger[] } = {};
        const selfChargeST: { [key: string]: Charger[] } = {};
        chargers.forEach((charger) => {
            let val: string | number = 0,
                id = charger.id,
                img = charger.img,
                name = charger.name,
                np = charger.np;

            if (np === "enemyAll") {
                charger.charges!.forEach((charge) => ((val as number) += charge.type === "self" ? charge.value : 0));
                val = [79.5, 80].includes(val) ? "79~80" : val;
                val = val > 100 ? "100+" : val;
                if (Object.keys(selfChargeAOE).includes(`${val}`)) {
                    selfChargeAOE[val].push({ id, name, img, np });
                } else {
                    selfChargeAOE[val] = [{ id, name, img, np }];
                }
            } else if (np === "enemy") {
                charger.charges!.forEach((charge) => ((val as number) += charge.type === "self" ? charge.value : 0));
                val = val > 100 ? "100+" : val;
                if (Object.keys(selfChargeST).includes(`${val}`)) {
                    selfChargeST[val].push({ id, name, img, np });
                } else {
                    selfChargeST[val] = [{ id, name, img, np }];
                } // repeating
            }
            this.setState({ selfChargeAOE, selfChargeST, loading: false });
        });
    }
    updateSupportChargers() {
        const partyChargers = this.state.chargers.filter((charger) =>
            charger.charges!.some((charge) => charge.type === "ptAll")
        );

        const partyCharge: { [key: string]: Charger[] } = {};
        partyChargers.forEach((charger) => {
            let val: string | number = 0,
                id = charger.id,
                img = charger.img,
                name = charger.name,
                np = charger.np;

            charger.charges!.forEach((charge) => ((val as number) += charge.type === "ptAll" ? charge.value : 0));
            if (Object.keys(partyCharge).includes(`${val}`)) {
                partyCharge[val].push({ id, name, img, np });
            } else {
                partyCharge[val] = [{ id, name, img, np }];
            }
            this.setState({ partyCharge, loading: false });
        });

        const allyChargers = this.state.chargers.filter((charger) =>
            charger.charges!.some((charge) => charge.type === "ptOne")
        );
        const allyCharge: { [key: string]: Charger[] } = {};
        allyChargers.forEach((charger) => {
            let val: string | number = 0,
                id = charger.id,
                img = charger.img,
                name = charger.name,
                np = charger.np;

            charger.charges!.forEach((charge) => ((val as number) += charge.type === "ptOne" ? charge.value : 0));
            val = val > 100 ? "100+" : val;
            if (Object.keys(allyCharge).includes(`${val}`)) {
                allyCharge[val].push({ id, name, img, np });
            } else {
                allyCharge[val] = [{ id, name, img, np }];
            }
            this.setState({ allyCharge, loading: false });
        });
    }
    render(): React.ReactNode {
        if (this.state.loading) return null;

        return (
            <Tabs id="charger-tabs">
                <Tab title="Self Charge AOE" eventKey="self-charge-aoe">
                    <Chargers chargers={this.state.selfChargeAOE} />
                </Tab>
                <Tab title="Self Charge ST" eventKey="self-charge-st">
                    <Chargers chargers={this.state.selfChargeST} />
                </Tab>
                <Tab title="Targeted & Party Chargers" eventKey="targeted-party-chargers">
                    <Chargers
                        chargers={{}}
                        partyChargers={this.state.partyCharge}
                        selfChargeSupport={this.state.selfChargeSupport}
                        allyChargers={this.state.allyCharge}
                    />
                </Tab>
            </Tabs>
        );
    }
}

export default App;
