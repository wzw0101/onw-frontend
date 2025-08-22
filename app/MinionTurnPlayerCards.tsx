import { useEffect, useState } from "react";
import { GetMinionData, HTTP_PREFIX, ResponseBody } from "./lib/constants";

interface MinionTurnPlayerCardAreaProps {
    playerId: string,
    players: string[]
}

export default function MinionTurnPlayerCards({ playerId, players }: MinionTurnPlayerCardAreaProps) {
    const [werewolfIndex, setWerewolfIndex] = useState(-1);
    useEffect(() => {
        fetch(`${HTTP_PREFIX}/player/${playerId}/minion-turn`)
            .then(response => response.json())
            .then((responseBody: ResponseBody<GetMinionData>) => {
                if (responseBody.code != 0) {
                    console.error(responseBody.message);
                    return;
                }
                setWerewolfIndex(responseBody.data.werewolfIndex);
            });
    }, []);

    return (
        <>{
            players.map((_, index) => {
                if (index === werewolfIndex) {
                    return <div key={`player-card-${index}`} className="flex justify-center items-center size-16 border-2" >"WEREWOLF"</div>
                } else {
                    return <div key={`player-card-${index}`} className="flex justify-center items-center size-16 border-2" />;
                }
            })
        }</>
    );
}