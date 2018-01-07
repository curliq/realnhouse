const lobbies = {
    Lobby1: "free",
    Lobby2: "free",
    Lobby3: "free",
    Lobby4: "free",
    Lobby5: "free",
    Lobby6: "free",
    Lobby7: "free"
}

exports.getLobby = (matchID) => {
    for (let key in lobbies) {
        if (lobbies[key] === "free") {
            lobbies[key] = matchID;
            return `**${key}**`;
        }
    }
    return "**No free lobby**";
}

exports.unsetLobby = (matchID) => {
    for (let key in lobbies) {
        if (lobbies[key] == matchID) {
            lobbies[key] = "free"
        }
    }
}