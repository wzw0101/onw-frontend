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
        <div className="flex gap-4">
            <button disabled={selected} className="btn btn-primary"
                onClick={async () => {
                    if (selected) {
                        return;
                    }
                    if (selectedIndex === roomInfo.seats.indexOf(playerId)) {
                        console.log("cannot vote your self");
                        return;
                    }
                    setSelected(true);
                    await fetch(`${HTTP_PREFIX}/player/${playerId}/vote/${selectedIndex}`, { method: "POST" });
                }}>vote</button>

            {
                roomInfo.hostPlayer === playerId &&
                (
                    <button className="btn btn-primary"
                        onClick={async () => {
                            await fetch(`${HTTP_PREFIX}/player/${playerId}/vote/done`, { method: "POST" });
                        }}>vote end</button>
                )

            }

            {
                <div className="flex">
                    {
                        roomInfo.seats.map((seatPlayerId, index) => {
                            return (
                                <div key={`vote-${seatPlayerId}`}
                                    className={`player ${index === selectedIndex ? "border-accent" : ""} `}
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