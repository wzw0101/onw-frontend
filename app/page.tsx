'use client';

import PlayerRoomForm from '@/app/PlayerRoomForm';
import { useState } from 'react';
import Room from './Room';

export default function Home() {
  const [playerId, setPlayerId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(0);

  return (
    <>
      <PlayerRoomForm playerId={playerId} setPlayerId={setPlayerId} roomId={roomId} setRoomId={setRoomId}
        connectionStatus={connectionStatus} setConnectionStatus={setConnectionStatus} />
      {
        connectionStatus > 0 &&
        <Room playerId={playerId} roomId={roomId}
          connectionStatus={connectionStatus} setConnectionStatus={setConnectionStatus} />
      }
    </>
  );
}
