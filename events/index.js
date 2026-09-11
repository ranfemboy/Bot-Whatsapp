const Call = require("./call");
const CustomCommand = require("./customcommand");
const Join = require("./join");
const Messages = require("./messages");
const Ready = require("./ready");
const Welcome = require("./welcome");

module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners);

    Call(bot);
    CustomCommand(bot);
    Join(bot);
    Messages(bot);
    Ready(bot);
    Welcome(bot);
};
