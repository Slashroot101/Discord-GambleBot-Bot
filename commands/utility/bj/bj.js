exports.getSumOfMap = function(map){
    let sum = 0;
    for(let i = 0; i < map.length; i++){
        sum += map[i][1].value;
    }
    return sum;
};

exports.getRandomIndex = function(map){
    let items = Array.from(map);
    return items[Math.floor(Math.random() * items.length)];
};