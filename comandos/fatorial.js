const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fatorial')
    .setDescription('Retorna o valor do número fatorial informado')
    .addNumberOption(option => option.setName('num').setDescription('Digite um número')),
    async execute (interaction){
    const num = interaction.options.getNumber('num');
    let fatorial = num;
    let resultado = fatorial;
        for (var i = 1; i < fatorial; i++) {
            resultado *= i;
        }
        res = resultado.toString()
        let embed = new Discord.MessageEmbed()
        .setColor('#0B00C8')
        .setTitle(`*Fatorial de ${fatorial}!*`)
        .addField("\u200b", res)
    await interaction.reply({ embeds: [embed] })
}
}