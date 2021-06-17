import { stat, defaultState, defaultFlag } from "../content-utils"

export const definitions = {
    econ: stat("Econ", "GiNetworkBars", "70%"),
    envi: stat("Envi", "GiThreeLeaves", "70%"),
    popMiner: stat("PopMiner", "GiGoldMine", "70%"),
    popUndec: stat("PopUndec", "GiBrainFreeze", "70%"),
    popEnvi: stat("PopEnvi", "GiSpotedFlower", "70%"),
    money: stat("Money", "GiMoneyStack"),
    greenEng: stat("GreenEng", "GiBoatPropeller", "70%"),
}
export const econ = definitions.econ.id
export const envi = definitions.envi.id
export const popMiner = definitions.popMiner.id
export const popUndec = definitions.popUndec.id
export const popEnvi = definitions.popEnvi.id
export const money = definitions.money.id
export const greenEng = definitions.greenEng.id

export const defaultStates = [
    defaultState(econ, 50),
    defaultState(envi, 50),
    defaultState(popMiner, 50),
    defaultState(popUndec, 50),
    defaultState(popEnvi, 50),
    defaultState(money, 50),
    defaultState(greenEng, 50),
    defaultState("daycycle", -1),
    defaultState("day", 0),
]

export const defaultFlags = [
    defaultFlag("tutorial:0", true),
    defaultFlag("init", true),
    defaultFlag("intro_finish", true),
    ...[
        "S1_Start",
        "Windfarm_Built",
        "Windfarm_Result",
        "ImportEng",
        "Wind_Build_Coast",
        "Wind_Build_Int",
        "GreenEng_Req",
        "GreenEng_NotReq",
        "Windfarm_Tourism",
        "Windfarm_Subs",
        "Coast_Shallow",
        "Coast_Deep",
        "Windfarm_Fin",
        "GreenEng_Response",
        "GreenEng_BizFirst",
        "GreenEng_FamFirst",
        "GreenEng_Incen",
        "GreenEng_NoIncen",
        "Windfarm_Public",
        "Windfarm_True",
        "Windfarm_Sale",
        "Windfarm_NoSale",
        "Seq1_Fin",
        "GreenEng_Fin",
        "GrenEng_Shut",
        "GreenEng_NoShut",
    ].map(id => defaultFlag(id.toLocaleLowerCase(), false))
]
