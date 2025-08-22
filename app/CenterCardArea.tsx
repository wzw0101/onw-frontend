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
        <ul className="flex gap-4 mb-8">
            {[0, 1, 2].map((index) => {
                if (gamePhase === "WEREWOLF_TURN" && playerRole === "WEREWOLF") {
                    return (
                        <li key={`center-card-${index}`} className={`flex justify-center items-center size-16 border-2 
                            ${index === selectedIndex ? "border-accent" : ""} cursor-pointer`}
                            onClick={() => !selected && setSelectedIndex(index)} >
                            {selected && selectedIndex === index && result}
                        </li>
                    );
                } else if (gamePhase === "DRUNK_TURN" && playerRole === "DRUNK") {
                    return (
                        <li key={`center-card-${index}`} className={`flex justify-center items-center size-16 border-2 
                            ${index === selectedIndex ? "border-accent" : ""} cursor-pointer`}
                            onClick={() => !selected && setSelectedIndex(index)} />
                    );
                } else {
                    return <li key={`center-card-${index}`} className="flex justify-center items-center size-16 border-2" />;
                }
            })}
        </ul>
    )
}