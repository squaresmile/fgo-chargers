import { Skill, Servant } from "@atlasacademy/api-connector";

interface Charge {
    value: number;
    type: string;
}

export interface Charger {
    charges?: Charge[];
    id: number;
    img: string;
    name: string;
    np: string;
}

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

const getServants = (async (): Promise<Servant.Servant[]> => {
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
})();

const getChargers: () => Promise<Charger[]> = async () => {
    return (await getServants).map((servant) => ({
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
};

export default getChargers;
