import React, { useEffect, useRef, useState } from "react";
import { Client, IMessage, ReconnectionTimeMode, StompSubscription } from "@stomp/stompjs";
import { AUTHORITY, GamePhase, GetInsomniacData, GetSeerData, GetWerewolfData, HTTP_PREFIX, MessageBody, PutRobberData, ResponseBody, RoleCard, RoomInfo, SeatData } from "./lib/constants";
import CenterCardArea from "./CenterCardArea";
import PlayerCardArea from "./PlayerCardArea";
import VoteArea from "./VoteArea";
import Button from "./components/Button";
import { post, put } from "./lib/lib";

interface RoomProps {
    playerId: string,
    roomId: string,
    connectionStatus: number,
    setConnectionStatus: React.Dispatch<React.SetStateAction<number>>
}

const playerColor = {
    RED: "bg-red-500",
    ORANGE: "bg-orange-500",
    YELLOW: "bg-yellow-500",
    GREEN: "bg-green-500",
    CYAN: "bg-cyan-500",
    BLUE: "bg-blue-500",
    PURPLE: "bg-purple-500",
    PINK: "bg-pink-500",
}

export default function Room({ playerId, roomId, connectionStatus, setConnectionStatus }: RoomProps) {
    const clientRef = useRef<null | Client>(null);
    const subscriptionRef = useRef<null | StompSubscription>(null);
    const [roomInfo, setRoomInfo] = useState<null | RoomInfo>(null);
    const [gamePhase, setGamePhase] = useState<GamePhase>("PREPARE");
    const [showRole, setShowRole] = useState(false);
    const [initialRole, setInitialRole] = useState<null | RoleCard>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedIndex2, setSelectedIndex2] = useState(-1);
    const [selected, setSelected] = useState(false);
    const [result, setResult] = useState("");
    const [mostVotedPlayer, setMostVotedPlayer] = useState<null | string>(null);

    async function handleSubscriptionMessage(message: IMessage) {
        const messageBody: MessageBody = JSON.parse(message.body);
        if (messageBody.eventType === "ROOM_STATE_CHANGED") {
            const newRoomInfo = messageBody.data;
            setRoomInfo(newRoomInfo);
        } else {
            setSelectedIndex(-1);
            setSelectedIndex2(-1);
            setSelected(false);
            setResult("");
            setMostVotedPlayer(null);
            setGamePhase(messageBody.gamePhase);
            if (messageBody.gamePhase === "INSOMNIAC_TURN") {
                const response = await fetch(`${HTTP_PREFIX}/player/${playerId}/insomniac-turn`);
                const responseBody: ResponseBody<GetInsomniacData> = await response.json();
                setResult(responseBody.data.roleCard);
            } else if (messageBody.gamePhase === "GAME_OVER") {
                const response = await fetch(`${HTTP_PREFIX}/player/${playerId}/vote/result`);
                const mostVotedPlayer = await response.text();
                setMostVotedPlayer(mostVotedPlayer);
            }
        }
    }

    if (clientRef.current === null) {
        clientRef.current = new Client({
            brokerURL: `ws://${AUTHORITY}/stomp/registry`,
            reconnectDelay: 1000,
            reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
            maxReconnectDelay: 10000,
            debug: (str) => console.log(str)
        });
        clientRef.current.onConnect = async function () {
            console.log("connected!");
            setConnectionStatus(2);
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = this.subscribe(`/topic/room/${roomId}`, handleSubscriptionMessage);
            const responseBody: ResponseBody<RoomInfo> = await (await fetch(`${HTTP_PREFIX}/player/${playerId}/room`)).json();
            setRoomInfo(responseBody.data);
        }
        clientRef.current.onDisconnect = function () {
            console.log("disconnected!");
        }
        clientRef.current.onWebSocketClose = () => {
            console.log("websocket closed!")
        }
    }

    useEffect(() => {
        console.log("use effect");
        clientRef.current?.activate();
        return () => {
            console.log("destruct effect");
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            clientRef.current?.deactivate();
        }
    }, []);

    if (!roomInfo || connectionStatus < 2) {
        return <div />;
    }

    const playerSeatNum = roomInfo.seats.indexOf(playerId);

    return (
        <div className="mt-4">
            <CenterCardArea roomInfo={roomInfo} gamePhase={gamePhase} selected={selected} result={result} initialRole={initialRole}
                selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
            <PlayerCardArea roomInfo={roomInfo} playerId={playerId} selected={selected} result={result} initialRole={initialRole}
                gamePhase={gamePhase} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                selectedIndex2={selectedIndex2} setSelectedIndex2={setSelectedIndex2} />
            <ul className="flex flex-row gap-4 mb-8">
                {roomInfo.seats.map((seatPlayerId, index) => seatPlayerId
                    ? <li key={`seat-${index}`} className={`indicator`}>
                        {roomInfo.readyList[index]
                            && <span className="indicator-item badge badge-success p-0 size-4" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg></span>}
                        <div className={`seat player ${playerColor[roomInfo.playerColorMap[seatPlayerId]]}`}>
                            {`${seatPlayerId}`}
                        </div></li>
                    : <li key={`seat-${index}`} className="seat" onClick={async () => {
                        // TODO setInitialRole here
                        const response = await fetch(`${HTTP_PREFIX}/player/${playerId}/seat/${index}`, { method: "POST" });
                        const responseBody: ResponseBody<SeatData> = await response.json();
                        if (responseBody.code) {
                            console.error(responseBody.message);
                            return;
                        }
                        setInitialRole(responseBody.data.initialRole);
                    }} />)}
            </ul>
            <div className="flex gap-4">
                {
                    [...roomInfo.players]
                        .filter((player) => !roomInfo.seats.includes(player))
                        .map((player) => (
                            <div key={player}
                                className={`player ${playerColor[roomInfo.playerColorMap[player]]}`}>
                                {player}
                            </div>))
                }
            </div>

            <div className="mt-8">
                <Button onClick={() => { setShowRole(!showRole) }}>show role</Button>

                {
                    gamePhase === "PREPARE" && playerSeatNum >= 0 &&
                    <Button onClick={() => {
                        fetch(`${HTTP_PREFIX}/player/${playerId}/ready/${!roomInfo.readyList[playerSeatNum]}`, { method: "PUT" });
                    }}>ready</Button>
                }

                {
                    gamePhase === "PREPARE" && roomInfo.hostPlayer === playerId &&
                    <Button onClick={() => { fetch(`${HTTP_PREFIX}/player/${playerId}/game-start`, { method: "POST" }); }} >start</Button>
                }

                {
                    gamePhase !== "PREPARE" && gamePhase !== "VOTE_TURN" && gamePhase !== "GAME_OVER" &&
                    (<Button onClick={async () => {
                        if (gamePhase === "TROUBLEMAKER_TURN") {
                            if (selectedIndex < 0 || selectedIndex2 < 0) {
                                return;
                            }
                            const responseBody: ResponseBody<null> = await put(
                                `${HTTP_PREFIX}/player/${playerId}/troublemaker-turn`, {
                                cardIndices: [selectedIndex, selectedIndex2]
                            });
                            if (responseBody.code !== 0) {
                                console.log("troublemaker put failed: %s", responseBody.message);
                                return;
                            }
                            setSelected(true);
                            return;
                        }

                        if (selectedIndex < 0) {
                            return;
                        }
                        if (gamePhase === "WEREWOLF_TURN") {
                            const params = new URLSearchParams();
                            params.append("cardIndex", selectedIndex.toString());
                            const response = await fetch(`${HTTP_PREFIX}/player/${playerId}/werewolf-turn?${params}`);
                            const responseBody = await response.json() as ResponseBody<GetWerewolfData>;
                            if (responseBody.code !== 0) {
                                console.log("get werewolf data faild with: %s", responseBody.message);
                                return;
                            }
                            setResult(responseBody.data.centerCard);
                        } else if (gamePhase === "SEER_TURN") {
                            const params = new URLSearchParams();
                            params.append("cardIndex", selectedIndex.toString());
                            const response = await fetch(`${HTTP_PREFIX}/player/${playerId}/seer-turn?${params}`);
                            const responseBody = await response.json() as ResponseBody<GetSeerData>;
                            if (responseBody.code !== 0) {
                                console.log("get seer data faild with: %s", responseBody.message);
                                return;
                            }
                            setResult(responseBody.data.roleCard);
                        } else if (gamePhase === "ROBBER_TURN") {
                            const responseBody: ResponseBody<PutRobberData> = await put(`${HTTP_PREFIX}/player/${playerId}/robber-turn`,
                                { cardIndex: selectedIndex });
                            if (responseBody.code !== 0) {
                                console.log("put rob failed: %s", responseBody.message);
                                return;
                            }
                            setResult(responseBody.data.roleCard);
                        } else if (gamePhase === "DRUNK_TURN") {
                            const responseBody: ResponseBody<null> = await put(`${HTTP_PREFIX}/player/${playerId}/drunk-turn`,
                                { cardIndex: selectedIndex });
                            if (responseBody.code !== 0) {
                                console.log("put drunk failed: %s", responseBody.message);
                                return;
                            }
                        }
                        setSelected(true);
                    }}>select</Button>)
                }

                {
                    gamePhase === "GAME_OVER" &&
                    <Button onClick={() => {
                        post(`${HTTP_PREFIX}/player/${playerId}/restart`, {});
                    }}>restart</Button>
                }
            </div>

            <div>
                <div>Game phase {gamePhase}</div>

                {
                    showRole && initialRole &&
                    <div>{initialRole}</div>
                }

                {
                    gamePhase === "VOTE_TURN" &&
                    <VoteArea roomInfo={roomInfo} playerId={playerId} selected={selected} setSelected={setSelected}
                        selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                }

                {
                    gamePhase === "GAME_OVER" &&
                    <div>Most voted player is {`${mostVotedPlayer}`}</div>
                }
            </div>

        </div >
    );
}