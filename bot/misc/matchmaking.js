const combinatorics = require("js-combinatorics");
const trueskill = require("ts-trueskill");
trueskill.TrueSkill();
exports.userIsRegistered = (userList, discordID) => {
    return userList.find(user => user.discordID === discordID);
}
exports.getClosestMatch = (players) => {
    const indices = [
        0,
        1,
        2,
        3,
        4,
        5
    ];
    let combination;
    const combinations = combinatorics.combination(indices, 3); //change this if you want more players per team
    const matchup = {
        teamA: [
            players[0], players[1], players[2]
        ],
        teamB: [
            players[3], players[4], players[5]
        ],
        quality: 0
    }
    while (combination = combinations.next()) {
        const teamA = [
            players[combination[0]],
            players[combination[1]],
            players[combination[2]]
        ]
        const teamARatings = teamA.map(playerA => playerA.rating);
        const teamBIds = indices.filter(index => combination.indexOf(index) === -1);
        const teamB = [
            players[teamBIds[0]],
            players[teamBIds[1]],
            players[teamBIds[2]]
        ];
        const teamBRatings = teamB.map(playerB => playerB.rating);

        const quality = trueskill.quality([teamARatings, teamBRatings])
        if (quality > matchup.quality) { // pick the match with the higest quality
            matchup.teamA = teamA;
            matchup.teamB = teamB;
            matchup.quality = quality;
        }
    }
    return matchup;
}