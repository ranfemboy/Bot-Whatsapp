const Check = require("./check");
const Permissions = require("./permissions");
const Restrictions = require("./restrictions");
const Rpg = require("./rpg");
const Track = require("./track");

module.exports = (bot) => {
    Check(bot);
    Permissions(bot);
    Restrictions(bot);
    Rpg(bot);
    Track(bot);
};