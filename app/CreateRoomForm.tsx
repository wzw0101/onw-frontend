'use client'

import React, { useState } from "react";
import { RoleCard } from "./lib/constants";

interface CreateRoomFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateRoomFormData) => void;
}

export interface CreateRoomFormData {
    numPlayers: number;
    selectedRoles: RoleCard[];
    turnDurationSeconds: number;
}

const ALL_ROLES: RoleCard[] = ["DRUNK", "INSOMNIAC", "MINION", "ROBBER", "SEER", "TROUBLEMAKER", "VILLAGER", "WEREWOLF"];

export default function CreateRoomForm({ isOpen, onClose, onSubmit }: CreateRoomFormProps) {
    const [numPlayers, setNumPlayers] = useState(4);
    const [selectedRoles, setSelectedRoles] = useState<RoleCard[]>(ALL_ROLES);
    const [turnDurationSeconds, setTurnDurationSeconds] = useState(20);

    const handleRoleToggle = (role: RoleCard) => {
        setSelectedRoles(prev => {
            if (prev.includes(role)) {
                return prev.filter(r => r !== role);
            } else {
                return [...prev, role];
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate: need exactly numPlayers + 3 (center cards) roles
        const requiredRoles = numPlayers + 3;
        if (selectedRoles.length !== requiredRoles) {
            alert(`Please select exactly ${requiredRoles} role cards (${numPlayers} players + 3 center cards). Currently selected: ${selectedRoles.length}`);
            return;
        }

        onSubmit({
            numPlayers,
            selectedRoles,
            turnDurationSeconds
        });
    };

    const handleNumPlayersChange = (value: number) => {
        setNumPlayers(value);
        // Auto-select enough roles if needed
        const minRolesNeeded = value + 3;
        if (selectedRoles.length < minRolesNeeded) {
            // Add missing roles from ALL_ROLES
            const missingRoles = ALL_ROLES.filter(r => !selectedRoles.includes(r));
            const rolesToAdd = missingRoles.slice(0, minRolesNeeded - selectedRoles.length);
            setSelectedRoles(prev => [...prev, ...rolesToAdd]);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Create Room</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Number of Players</span>
                        </label>
                        <input
                            type="number"
                            min="3"
                            max="5"
                            value={numPlayers}
                            onChange={(e) => handleNumPlayersChange(parseInt(e.target.value) || 3)}
                            className="input input-bordered"
                            required
                        />
                        <label className="label">
                            <span className="label-text-alt">Select 3-5 players</span>
                        </label>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Role Cards</span>
                            <span className="label-text-alt">Need exactly {numPlayers + 3} cards</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {ALL_ROLES.map(role => (
                                <label key={role} className="label cursor-pointer justify-start gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => handleRoleToggle(role)}
                                        className="checkbox checkbox-primary"
                                        disabled={selectedRoles.includes(role) && selectedRoles.length === numPlayers + 3}
                                    />
                                    <span className="label-text">{role}</span>
                                </label>
                            ))}
                        </div>
                        <label className="label">
                            <span className="label-text-alt">Selected: {selectedRoles.length} / {numPlayers + 3} required</span>
                        </label>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Turn Duration (seconds)</span>
                        </label>
                        <input
                            type="number"
                            min="5"
                            max="300"
                            value={turnDurationSeconds}
                            onChange={(e) => setTurnDurationSeconds(parseInt(e.target.value) || 20)}
                            className="input input-bordered"
                            required
                        />
                        <label className="label">
                            <span className="label-text-alt">Duration for each turn (5-300 seconds)</span>
                        </label>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={selectedRoles.length !== numPlayers + 3}
                        >
                            Create Room
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </form>
        </dialog>
    );
}
