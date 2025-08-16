import Button from "./components/Button";
import { HTTP_PREFIX, RoomInfo } from "./lib/constants";

interface VoteAreaProps {
    roomInfo: RoomInfo,
    playerId: string,
    selected: boolean
    setSelected: React.Dispatch<React.SetStateAction<boolean>>
    selectedIndex: number
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function VoteArea({
    roomInfo, playerId, selected, setSelected, selectedIndex, setSelectedIndex
}: VoteAreaProps) {
    return (
        <div className="vote-area">
            <Button disabled={selected} onClick={async () => {
                if (selected) {
                    return;
                }
                if (selectedIndex === roomInfo.seats.indexOf(playerId)) {
                    console.log("cannot vote your self");
                    return;
                }
                setSelected(true);
                await fetch(`${HTTP_PREFIX}/player/${playerId}/vote/${selectedIndex}`, { method: "POST" });
            }}>vote</Button>

            {
                roomInfo.hostPlayer === playerId &&
                (
                    <Button onClick={async () => {
                        await fetch(`${HTTP_PREFIX}/player/${playerId}/vote/done`, { method: "POST" });
                    }}>vote end</Button>
                )

            }

            {
                <div className="flex">
                    {
                        roomInfo.seats.map((seatPlayerId, index) => {
                            return (
                                <div key={`vote-${seatPlayerId}`} className={`player ${index === selectedIndex ? "selected" : ""}`}
                                    onClick={() => {
                                        !selected && setSelectedIndex(index)
                                    }}>
                                    {seatPlayerId}
                                </div>
                            );
                        })
                    }
                </div>
            }
        </div >
    );
}