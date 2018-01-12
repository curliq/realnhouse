const shuffle = require("lodash").shuffle;
const mapList = [
    "Araz Day",
    "Araz Night",
    "Skyring Night",
    "Orman Night",
    "Blackstone Day",
    "Blackstone Night",
    "Dragon Day",
    "Dragon Night"
];
exports.getMaps = () => {
    const tempMaps = shuffle(mapList);
    return `1: ${tempMaps[0]}
2: ${tempMaps[1]}
3: ${tempMaps[2]}`;
}