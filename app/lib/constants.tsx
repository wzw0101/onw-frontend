export const AUTHORITY = '127.0.0.1:8080';
export const HTTP_PREFIX = `http://${AUTHORITY}`

export interface ResponseBody<T> {
    code: number;
    message: string;
    data: T
}

export type PlayerColor = "RED" | "ORANGE" | "YELLOW" | "GREEN" | "CYAN" | "BLUE" | "PURPLE" | "PINK";
export type RoleCard = "DRUNK" | "INSOMNIAC" | "MINION" | "ROBBER" | "SEER" | "TROUBLEMAKER" | "VILLAGER" | "WEREWOLF";
export type EventType = "ROOM_STATE_CHANGED" | "GAME_START";

export interface Player {
    userId: string,
    roomId: string
}

export interface RoomInfo {
    id: string,
    players: Set<string>,
    seats: Array<string>,
    readyList: Array<boolean>,
    playerColorMap: { [index: string]: PlayerColor },
    hostPlayer: string,
}

export interface SeatData {
    initialRole: RoleCard,
}

export interface GetWerewolfData {
    werewolfIndex: number,
    centerCard: RoleCard
}

export interface GetMinionData {
    werewolfIndex: number,
}

export interface GetSeerData {
    roleCard: RoleCard,
}

export interface GetInsomniacData {
    roleCard: RoleCard,
}

export interface PutRobberData {
    roleCard: RoleCard,
}

export interface RoomChangedMessageBody {
    eventType: "ROOM_STATE_CHANGED",
    data: RoomInfo
}

export interface PhaseChangedMessageBody {
    eventType: "PHASE_CHANGED",
    gamePhase: GamePhase
}

export type GamePhase = "PREPARE" | "GAME_START" | "WEREWOLF_TURN" | "MINION_TURN" | "SEER_TURN" | "ROBBER_TURN" | "TROUBLEMAKER_TURN"
    | "DRUNK_TURN" | "INSOMNIAC_TURN" | "VOTE_TURN" | "GAME_OVER";

export type MessageBody = RoomChangedMessageBody | PhaseChangedMessageBody;

export interface VoteResult {
    [playerId: string]: number
}