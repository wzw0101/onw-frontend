import { useEffect, useState } from "react";
import { GetInsomniacData, HTTP_PREFIX, ResponseBody } from "./lib/constants";

interface InsomniacTurnPlayerCardAreaProps {
    playerId: string,
    players: string[]
}

export default function InsomniacTurnPlayerCardArea({ playerId, players }: InsomniacTurnPlayerCardAreaProps) {
    const [roleCard, setRoleCard] = useState("");

    useEffect(() => {
        fetch(`${HTTP_PREFIX}/player/${playerId}/insomniac-turn`)
            .then(response => response.json())
            .then((responseBody: ResponseBody<GetInsomniacData>) => {
                if (responseBody.code != 0) {
                    console.error(responseBody.message);
                    return;
                }
                setRoleCard(responseBody.data.roleCard);
            });
    }, []);

    const playerSeatNum = players.indexOf(playerId);

    return (
        <>{
            players.map((_, index) => {
                if (index === playerSeatNum) {
                    return <div key={`player-card-${index}`} className="card" >{`${roleCard}`}</div>
                } else {
                    return <div key={`player-card-${index}`} className="card" />;
                }
            })
        }</>
    );
}