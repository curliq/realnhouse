const shuffle = require("lodash").shuffle;
const mapList = [
    "Mount Araz - Day",
    "Mount Araz - Night",
    "Skyring - Night",
    "Blackstone - Day",
    "Blackstone - Night",
    "Dragon Garden - Day",
    "Dragon Garden - Night",
    "Daharin Battlegrounds – Day",
    "Daharin Battlegrounds – Night",
    "Meriko Summit – Day",
    "Meriko Summit – Night"
];
exports.getMaps = () => {
    const tempMaps = shuffle(mapList);
    return `1: ${tempMaps[0]}
    2: ${tempMaps[1]}
    3: ${tempMaps[2]}`;
}