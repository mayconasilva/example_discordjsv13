const Discord = require("discord.js")
module.exports.run = async(client, message, args) => {
    message.channel.send(`A latência é igual a ${client.ws.ping}`)
}