import { GamePhase, RoleCard, RoomInfo } from "./lib/constants";

interface CenterCardAreaProps {
    roomInfo: RoomInfo,
    gamePhase: GamePhase,
    selected: boolean,
    selectedIndex: number,
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
    result: string,
    initialRole: null | RoleCard,
}

export default function CenterCardArea({
    roomInfo, gamePhase, selected, selectedIndex, setSelectedIndex, result, initialRole
}: CenterCardAreaProps) {

    const playerRole = initialRole;

    return (
        <div className="flex gap-4 mb-8">
            {[0, 1, 2].map((index) => {
                if (gamePhase === "WEREWOLF_TURN" && playerRole === "WEREWOLF") {
                    return (
                        <div key={`center-card-${index}`} className={`card ${index === selectedIndex ? "outline-primary" : ""}`}
                            onClick={() => !selected && setSelectedIndex(index)} >
                            {selected && result}
                        </div>
                    );
                } else if (gamePhase === "DRUNK_TURN" && playerRole === "DRUNK") {
                    return (
                        <div key={`center-card-${index}`} className={`card ${index === selectedIndex ? "outline-primary" : ""}`}
                            onClick={() => !selected && setSelectedIndex(index)} />
                    );
                } else {
                    return <div key={`center-card-${index}`} className="card" />;
                }
            })}
        </div>
    )
}