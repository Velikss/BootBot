const Discord = require(`discord.js`);
const Datetime = require("date-and-time");


const client = new Discord.Client();
client.config = require("./config.json");
client.logger = require("./functions/logger");


client.login(client.config.token);

client.on("ready", () => {
  client.logger.log(`Bot is online | Connected as: ${client.user.username} | Guilds: ${client.guilds.size}`,"ready");
})

client.on("message", async message => {
  if(message.author.bot) return;

  const args = message.content.trim().split(/ +/g);

  //Check if I am tagged
  if(args[0] !== `<@${client.user.id}>`) return;
  client.logger.log(`Received message: ${message.content}`);

  //Check if user is allowed to use me
  if(message.author.id != "294909299287654401") return;

  if(args[1] == "flag") {
    //Create role if not exists
    const role = message.guild.roles.find(x => x.name == 'Inactive');
    if(!role) {
      message.guild.createRole({
        name: 'Inactive',
        color: 'RED',
      })
      .then(role => client.logger.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
    }

    const filter = m => m.author.id === message.author.id;

    message.reply("For which date do I have to check? (DD-MM-YYYY)");
    message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected => {
      var msg = collected.first().content;
      var date = Datetime.parse(msg, 'DD-MM-YYYY');
      if(isNaN(date))
        message.reply("I don't recognize this as a valid date.")
      else {
        var counter = 0;
        message.guild.members.array().forEach((member) => {
          // if(!member.user.bot) {
            //Add role if user fits criteria
            if(member.lastMessage == undefined || member.lastMessage.createdAt < date) {
              member.addRole(role.id);
              counter++;
            } else {
              //Make sure user doesnt have role.
              member.removeRole(role.id);
            }
          // }
        });
        message.reply(`I have marked ${counter} users as inactive.`);
      }
    }).catch(err => {
      client.logger.error(err);
    })
  }

  if(args[1] == "unflag") {
    //Make sure role exists
    const role = message.guild.roles.find(x => x.name == 'Inactive');
    if(role) {
      var flagCounter = 0;

      message.guild.members.array().forEach((member) => {
        if(member.roles.find(r => r.name === "Inactive" )) {
           member.removeRole(role.id);
           flagCounter++;
         }
      });

      message.reply(`Unflagged ${flagCounter} users.`)
    } else {
      message.reply(`No flagged users found.`);
    }
  }

  if(args[1] == "purge") {
    var purgeCounter = 0;
    const filter = m => m.author.id === message.author.id;

    message.guild.members.array().forEach((member) => {
      if(member.roles.find(r => r.name === "Inactive" ))
        purgeCounter++;
    });

    message.reply(`This will kick ${purgeCounter} users! Type "Yes" to continue or "No" to cancel...`);
    message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected => {
      var msg = collected.first().content;
      var x = 0;
      if(msg.toLowerCase() == "yes") {
        message.channel.send(`Commencing the great purge...`);
        message.guild.members.array().forEach((member) => {
          if(member.roles.find(r => r.name === "Inactive" )) {
            member.kick().then(() => client.logger.log(`Kicked ${member.displayName} from ${message.guild.name}`));
            x++;
          }
        })
        message.reply(`I kicked ${x} users!`);
      } else {
        message.channel.send("Purge has been cancelled.");
      }
    }).catch(err => {
      client.logger.error(err);
    })
  }

})
