import { Faction } from "@/context/GameContext/types";

export type FactionLabel = {
    name: string;
    title: string;
};

export const getFactionLabel = (
    boardColor: "white" | "black",
    playerFaction: Faction | null
): FactionLabel => {
    const isDefault = !playerFaction || playerFaction === "human";

    const humanLabel: FactionLabel = { name: "HUMANOS", title: "IMPÉRIO" };
    const orcLabel: FactionLabel = { name: "ORCS", title: "CLÃ" };

    if (isDefault) {
        return boardColor === "white" ? humanLabel : orcLabel;
    }
    return boardColor === "white" ? orcLabel : humanLabel;
};
