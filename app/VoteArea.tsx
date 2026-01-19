import { HTTP_PREFIX, RoomInfo } from "./lib/constants";

interface VoteAreaProps {
    roomInfo: RoomInfo,
    playerId: string,
    selectedIndex: number
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function VoteArea({
    roomInfo, playerId, selectedIndex, setSelectedIndex
}: VoteAreaProps) {
    return (
        <>
            <div className="flex gap-4 mb-4">
                <button className="btn btn-primary"
                    onClick={async () => {
                        if (selectedIndex === roomInfo.seats.indexOf(playerId)) {
                            console.log("cannot vote your self");
                            return;
                        }
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
            </div>
            <div className="flex gap-4 mb-4">
                <div key="center-vote"
                    className={`flex justify-center items-center size-16 rounded-md border-2 ${selectedIndex === -1 ? "border-accent" : ""} cursor-pointer`}
                    onClick={() => {
                        setSelectedIndex(-1);
                    }}>
                    Center
                </div>
                {
                    roomInfo.seats.map((seatPlayerId, index) => {
                        return (
                            <div key={`vote-${seatPlayerId}`}
                                className={`flex justify-center items-center size-16 rounded-md border-2 ${index === selectedIndex ? "border-accent" : ""} cursor-pointer`}
                                onClick={() => {
                                    setSelectedIndex(index);
                                }}>
                                {seatPlayerId}
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}