'use client'

import React, { useState } from "react";
import { HTTP_PREFIX } from "./lib/constants";
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
                <label className="input input-ghost">
                    Player ID
                    <input value={playerId} onChange={(e) => setPlayerId(e.target.value)} disabled={!editPlayer} className="grow" />
                </label>
                <label className="swap">
                    <input className="peer"
                        type="checkbox" onClick={() => setEditPlayer(!editPlayer)} disabled={connectionStatus != 0} />
                    {/* edit button */}
                    <svg className="size-6 swap-off peer-disabled:text-base-content/30"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    {/* confirm button */}
                    <svg className="size-6 swap-on peer-disabled:text-base-content/30"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </label>
            </div>

            {
                !!playerId && !editPlayer
                && <div className="flex items-center">
                    <label className="input input-ghost">
                        Room ID
                        <input disabled={!!connectionStatus} value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="grow" />
                    </label>
                    <label className={`swap ${connectionStatus !== 0 ? 'swap-active' : ''}`} onClick={async () => {
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
                        {/* connect icon */}
                        <svg className={`size-6 swap-off`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                        {/* disconnect icon */}
                        <svg className={`size-6 swap-on`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9" />
                        </svg>
                    </label>
                    <button disabled={!!connectionStatus} className="btn btn-ghost"
                        onClick={async () => {
                            const roomId = await (
                                await fetch(`${HTTP_PREFIX}/player/${playerId}/room`, { method: "POST" })
                            ).text();
                            setConnectionStatus(1)
                            setRoomId(roomId);
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            }
        </div >
    );
}