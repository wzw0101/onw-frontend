import React from "react";
import { GamePhase, RoleCard, RoomInfo } from "./lib/constants";
import MinionTurnPlayerCardArea from "./MinionTurnPlayerCards";
import InsomniacTurnPlayerCardArea from "./InsomniacTurnPlayerCardArea";

interface PlayerCardAreaProps {
    roomInfo: RoomInfo,
    gamePhase: GamePhase,
    playerId: string,
    selectedIndex: number,
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
    selected: boolean,
    result: string
    selectedIndex2: number,
    setSelectedIndex2: React.Dispatch<React.SetStateAction<number>>,
    initialRole: null | RoleCard,
}

export default function PlayerCardArea({
    roomInfo, gamePhase, playerId, selectedIndex, setSelectedIndex, selected, result, selectedIndex2, setSelectedIndex2, initialRole
}: PlayerCardAreaProps) {
    let playerCards: React.ReactElement;
    if (gamePhase === "MINION_TURN" && initialRole === "MINION") {
        playerCards = <MinionTurnPlayerCardArea playerId={playerId} players={roomInfo.seats} />;
    } else if (gamePhase === "INSOMNIAC_TURN" && initialRole === "INSOMNIAC") {
        playerCards = <InsomniacTurnPlayerCardArea playerId={playerId} players={roomInfo.seats} />
    } else if (gamePhase === "TROUBLEMAKER_TURN" && initialRole === "TROUBLEMAKER") {
        playerCards = (<> {
            roomInfo.seats.map((_, index) => {
                return (
                    <li key={`player-card-${index}`}
                        className={`flex justify-center items-center size-16 border-2 rounded-md
                            ${[selectedIndex, selectedIndex2].includes(index) ? "border-accent" : ""}  cursor-pointer`}
                        onClick={() => {
                            if (selected) {
                                return;
                            }
                            if (index === selectedIndex) {
                                setSelectedIndex(-1);
                            } else if (index === selectedIndex2) {
                                setSelectedIndex2(-1);
                            } else if (selectedIndex === -1) {
                                setSelectedIndex(index);
                            } else if (selectedIndex2 === -1) {
                                setSelectedIndex2(index);
                            }
                        }} />);
            })
        }</>);
    } else if ((gamePhase === "SEER_TURN" && initialRole === "SEER") || (gamePhase === "ROBBER_TURN" && initialRole === "ROBBER")) {
        playerCards = (<> {
            roomInfo.seats.map((_, index) => {
                return (
                    <li key={`player-card-${index}`}
                        className={`flex justify-center items-center size-16 border-2 rounded-md
                            ${[selectedIndex, selectedIndex2].includes(index) ? "border-accent" : ""}  cursor-pointer`}
                        onClick={() => !selected && setSelectedIndex(index)}>
                        {selected && index === selectedIndex && result}
                    </li>);
            })
        }</>);
    } else {
        playerCards = (<>{
            roomInfo.seats.map((_, index) =>
                <li key={`player-card-${index}`} className="flex justify-center items-center size-16 border-2 rounded-md" />)
        }</>)
    }
    return (
        <ul className="flex gap-4 mb-8">
            {playerCards}
        </ul>
    )
}