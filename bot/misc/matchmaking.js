const combinatorics = require("js-combinatorics");
const trueskill = require("ts-trueskill");
trueskill.TrueSkill();

exports.userIsRegistered = (userList, discordID) => {
    return userList.find(user => user.discordID === discordID);
}

exports.getClosestMatch = (players) => {
    const matchup = {
        teamA: [
            players[0]
        ],
        teamB: [
            players[1]
        ],
        teamC: [
            players[2]
        ],
        teamD: [
            players[3]
        ],
        teamE: [
            players[4]
        ],
        teamF: [
            players[5]
        ],
        teamG: [
            players[6]
        ],
        teamH: [
            players[7]
        ],
        teamI: [
            players[8]
        ],
        teamJ: [
            players[9]
        ],
        quality: 0
    }

    const teamARatings = matchup.teamA.map(player => player.rating);
    const teamBRatings = matchup.teamB.map(player => player.rating);
    const teamCRatings = matchup.teamC.map(player => player.rating);
    const teamDRatings = matchup.teamD.map(player => player.rating);
    const teamERatings = matchup.teamE.map(player => player.rating);
    const teamFRatings = matchup.teamF.map(player => player.rating);
    const teamGRatings = matchup.teamG.map(player => player.rating);
    const teamHRatings = matchup.teamH.map(player => player.rating);
    const teamIRatings = matchup.teamI.map(player => player.rating);
    const teamJRatings = matchup.teamJ.map(player => player.rating);

    const quality = trueskill.quality([teamARatings, teamBRatings, teamCRatings, teamDRatings, teamERatings, teamFRatings, teamGRatings, teamHRatings, teamIRatings, teamJRatings])
    matchup.quality = quality;
    return matchup;
}