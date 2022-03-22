import { Skill, Servant } from "@atlasacademy/api-connector";

interface Charge {
    value: number;
    type: string;
}

export interface Charger {
    charges: Charge[];
    id: number;
    img: string;
    name: string;
    np: string;
}

type ChargeInfoMap = Map<string, Charger[]>;

export interface ChargeInfo {
    chargeValue: string;
    chargers: Charger[];
}

export interface CategorizedChargeInfo {
    chargers: Charger[];
    selfChargeAOE: ChargeInfo[];
    selfChargeST: ChargeInfo[];
    selfChargeSupport: ChargeInfo[];
    partyCharge: ChargeInfo[];
    allyCharge: ChargeInfo[];
}

const chargeSum = (charges: Charge[], chargeType: "self" | "ptAll" | "ptOne") => {
    return charges.reduce((acc, charge) => (acc += charge.type === chargeType ? charge.value : 0), 0);
};

const mapToChargeInfo = (chargeMap: Map<string, Charger[]>): ChargeInfo[] => {
    return Array.from(chargeMap.entries()).map(([chargeValue, chargers]) => {
        return { chargeValue, chargers };
    });
};

const getCharges = (_skills: Skill.Skill[]): Charge[] => {
    const skills = _skills.slice();
    skills.forEach((skill) => (skills[skill.num! - 1] = skill));
    const skillFuncs = skills.slice(0, 3).map((skill) => skill.functions.find((func) => func.funcType === "gainNp"));
    const charges = skillFuncs.map((func) => {
        let value = func && func.functvals.length === 0 ? func.svals[9].Value! / 100 : 0;
        let type = func?.funcTargetType && value ? func.funcTargetType : "";
        return { value, type };
    });

    return charges;
};

const getServants = async (): Promise<Servant.Servant[]> => {
    const servants: Servant.Servant[] = await (
        await fetch("https://api.atlasacademy.io/export/JP/nice_servant_lang_en.json")
    ).json();

    servants.find((serv) => serv.id === 1000900)!.noblePhantasms = []; // Kingprotea

    const melu = { ...servants.find((serv) => serv.id === 304800)! };
    const [meluNPAsc12, meluNpAsc3] = melu.noblePhantasms;
    const [meluSkill1, meluSkill2, meluSkill3Asc12, meluSkill3Asc3] = melu.skills;
    servants.find((serv) => serv.id === 304800)!.noblePhantasms = [];
    servants.find((serv) => serv.id === 304800)!.skills = [];
    servants.push(
        {
            ...melu,
            noblePhantasms: [meluNpAsc3],
            skills: [meluSkill1, meluSkill2, meluSkill3Asc3],
        },
        {
            ...melu,
            noblePhantasms: [meluNPAsc12],
            skills: [meluSkill1, meluSkill2, meluSkill3Asc12],
        }
    );

    return servants;
};

const getSelfChargers = (chargers: Charger[]) => {
    const selfChargeAOE: ChargeInfoMap = new Map();
    const selfChargeST: ChargeInfoMap = new Map();
    chargers
        .filter((charger) => charger.charges.some((charge) => charge.type === "self"))
        .forEach((charger) => {
            const chargeValue = chargeSum(charger.charges, "self");
            if (charger.np === "enemyAll") {
                const valText = [79.5, 80].includes(chargeValue)
                    ? "79~80"
                    : chargeValue > 100
                    ? "100+"
                    : chargeValue.toString();
                const mapValue = selfChargeAOE.get(valText);
                if (mapValue !== undefined) {
                    mapValue.push(charger);
                } else {
                    selfChargeAOE.set(valText, [charger]);
                }
            } else if (charger.np === "enemy") {
                const valText = chargeValue > 100 ? "100+" : chargeValue.toString();
                const mapValue = selfChargeST.get(valText);
                if (mapValue !== undefined) {
                    mapValue.push(charger);
                } else {
                    selfChargeST.set(valText, [charger]);
                }
            }
        });
    return { selfChargeAOE: mapToChargeInfo(selfChargeAOE), selfChargeST: mapToChargeInfo(selfChargeST) };
};

const getSupportChargers = (chargers: Charger[]) => {
    const partyCharge: ChargeInfoMap = new Map();
    chargers
        .filter((charger) => charger.charges.some((charge) => charge.type === "ptAll"))
        .forEach((charger) => {
            const chargeValue = chargeSum(charger.charges, "ptAll");
            const valText = chargeValue.toString();
            const mapValue = partyCharge.get(valText);
            if (mapValue !== undefined) {
                mapValue.push(charger);
            } else {
                partyCharge.set(valText, [charger]);
            }
        });

    const allyCharge: ChargeInfoMap = new Map();
    chargers
        .filter((charger) => charger.charges.some((charge) => charge.type === "ptOne"))
        .forEach((charger) => {
            const chargeValue = chargeSum(charger.charges, "ptOne");
            const valText = chargeValue > 100 ? "100+" : chargeValue.toString();
            const mapValue = allyCharge.get(valText);
            if (mapValue !== undefined) {
                mapValue.push(charger);
            } else {
                allyCharge.set(valText, [charger]);
            }
        });

    return { partyCharge: mapToChargeInfo(partyCharge), allyCharge: mapToChargeInfo(allyCharge) };
};

const getChargers: () => Promise<CategorizedChargeInfo> = async () => {
    const servants = await getServants();
    const chargers = servants.map((servant) => ({
        charges: getCharges(servant.skills),
        id: servant.id,
        img: servant.extraAssets.faces.ascension?.[1]
            ? `${servant.extraAssets.faces.ascension?.[1].split(".png")[0]}_bordered.png`
            : "",
        name: `${servant.name ?? ""} (${
            servant.className ? `${servant.className[0].toUpperCase()}${servant.className.slice(1)}` : ""
        })`,
        np: servant.noblePhantasms[servant.noblePhantasms.length - 1]?.functions.some((func) =>
            func.funcType.includes("damageNp")
        )
            ? servant.noblePhantasms[servant.noblePhantasms.length - 1]?.functions.filter((func) =>
                  func.funcType.includes("damageNp")
              )[0].funcTargetType
            : "",
    }));
    const { selfChargeAOE, selfChargeST } = getSelfChargers(chargers);
    const { partyCharge, allyCharge } = getSupportChargers(chargers);
    return { chargers, selfChargeAOE, selfChargeST, selfChargeSupport: [], partyCharge, allyCharge };
};

export default getChargers;
