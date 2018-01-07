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
    mapList = _.shuffle(mapList);
    return `1: ${mapList[0]}
2: ${mapList[1]}
3: ${mapList[2]}`;
}