'use client'

import React, { useState } from "react";
import { HTTP_PREFIX, RoomInfo } from "./lib/constants";
import Button from "./components/Button";
import TextInput from "./components/TextInput";
import { ResponseBody } from "./lib/constants";

interface FormType {
    playerId: string,
    setPlayerId: React.Dispatch<React.SetStateAction<string>>,
    roomId: string,
    setRoomId: React.Dispatch<React.SetStateAction<string>>
    connectionStatus: number,
    setConnectionStatus: React.Dispatch<React.SetStateAction<number>>
};

export default function Form({ playerId, setPlayerId, roomId, setRoomId, connectionStatus, setConnectionStatus }: FormType) {
    const [editPlayer, setEditPlayer] = useState(false);

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <label htmlFor="playerId" className="ms-2">
                    Player ID
                    <TextInput id="playerId" value={playerId} setValue={setPlayerId} disabled={!editPlayer}
                        className="mx-4" />
                </label>
                <Button onClick={() => setEditPlayer(!editPlayer)} disabled={connectionStatus != 0} />
            </div>

            {
                !!playerId && !editPlayer &&
                <>
                    <div className="flex items-center">
                        <label className="ms-2">
                            Room ID
                            <TextInput id="roomId" disabled={!!connectionStatus} value={roomId} setValue={setRoomId}
                                className="mx-4" />
                        </label>

                        <Button onClick={async () => {
                            if (connectionStatus) {
                                await fetch(`${HTTP_PREFIX}/player/${playerId}/room`, { method: "DELETE" });
                                setConnectionStatus(0);
                            } else {
                                const response = await fetch(`${HTTP_PREFIX}/player/${playerId}/room/${roomId}`, { method: "POST" });
                                const responseBody = await response.json() as ResponseBody<null>;
                                if (responseBody.code != 0) {
                                    console.error(`enter room failed, error message ${responseBody.message}`);
                                } else {
                                    setConnectionStatus(1);
                                }
                            }
                        }}>
                            {!!connectionStatus ? "Disconnect" : "Connect"}
                        </Button>
                    </div>

                    <div className="flex items-center">
                        <Button disabled={!!connectionStatus}
                            onClick={async () => {
                                const roomId = await (
                                    await fetch(`${HTTP_PREFIX}/player/${playerId}/room`, { method: "POST" })
                                ).text();
                                setConnectionStatus(1)
                                setRoomId(roomId);
                            }}>
                            Create Room
                        </Button>
                    </div>
                </>
            }
        </div >
    );
}