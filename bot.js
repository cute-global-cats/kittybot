// 24/7 hour script
const http = require('http');
const express = require('express');
const app = express();
const cmd = require('node-cmd');
const crypto = require("crypto");
/*global Set, Map*/
app.use(express.static('public'));

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendFile(__dirname + '/index.html');
});
app.post('/git', (req, res) => {
  let hmac = crypto.createHmac('sha1', process.env.SECRET)
  let sig = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex')

  // If event is "push" and secret matches config.SECRET
  if (
    req.headers['x-github-event'] == 'push' &&
    sig == req.headers['x-hub-signature']
  ) {
    cmd.run('chmod 777 ./git.sh') // :/ Fix no perms after updating
    cmd.get('./git.sh', (err, data) => {
      if (data) log.info(data)
      if (err) log.error(err)
    })

    let commits =
        req.body.head_commit.message.split('\n').length == 1
          ? req.body.head_commit.message
          : req.body.head_commit.message
            .split('\n')
            .map((el, i) => (i !== 0 ? '                       ' + el : el))
            .join('\n')
    console.log(
      '\n\n [GIT] Updated with origin/master\n' +
      `        Latest commit: ${commits}`
    )

    cmd.get('refresh', err => {
      if (err) log.error(err)
    })

    return res.sendStatus(200)
  } else return res.sendStatus(400)
})
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);


const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const animals = require('random-animals-api');
const got = require("got")
const newUsers = new Discord.Collection();

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setPresence({ game: { name: 'beautiful people', type: "WATCHING" }, status: 'online' })
  // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
    })
});



client.on("message", async message => {
  console.log(message.author.tag + " sent this: (" + message.content + ") in " + message.guild + "'s channel #" + message.channel.name + "(" + message.channel.id + ")");
  if (message.author.bot) return;

  if(message.guild === null){
    client.channels.get("572458414878228486").send(message.author.tag + " said this in a DM to me: \n```\n" + message.content + "\n```");
    console.log(message.author.tag + " said this in a DM to me: \n```\n" + message.content + "\n```");
  };


  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if(command === "help") {
    const embed = new Discord.RichEmbed()
    .setTitle("My Commands")
    .setAuthor(client.user.username, client.user.avatarURL)
    .setDescription("Here is the list of my commands!")
    .setColor(0x00AE86)
    .addField(config.prefix + "ping", "See the bot's latency", true)
    .addField(config.prefix + "animals", "See what animals you can get pictures of", true)
    .addField(config.prefix + "meme", "Get yourself a good meme", true)
    .addField(config.prefix + "purge", "Delete messages with the first argument as the number of messages to delete", true)
    .setFooter("More Commands coming soon! Contribute at https://github.com/cute-global-cats/kittybot")
    message.channel.send({embed});
  }

  if(command === "purge"){
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    let amountToPurge = parseInt(args[0])
    if (isNaN(amountToPurge)) { message.channel.send(`${args[0]} is not a number! Try again.`); return }
    message.delete().catch(O_o=>{});
    message.channel.bulkDelete(amountToPurge)
      .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
      .catch(console.error);
  }

  if(command === "say") {
    if(config.eval.some(user => user === message.author.id) === true) {
    message.delete().catch(O_o=>{});
    message.channel.startTyping();
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
    message.channel.stopTyping();
    }
  }
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    message.delete().catch(O_o=>{});
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! :ping_pong: Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "cat"){
    animals.cat().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }

  if(command === "dog"){
    animals.dog().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }

  if(command === "bird"){
    animals.bird().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "fox"){
    animals.fox().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "bunny"){
    animals.bunny().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "lizard"){
    animals.lizard().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "owl"){
    animals.owl().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "tiger"){
    animals.tiger().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "shiba"){
    animals.shiba().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "lion"){
    animals.lion().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "duck"){
    animals.duck().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "panda"){
    animals.panda().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }
  if(command === "penguin"){
    animals.penguin().then(url => {
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription("Here's your " + command + " picture!")
    .setColor(16711680)
    .setImage(url)
    .setTimestamp();
    message.channel.send(embed)
    })
  }

  if(command === "animals"){
    message.channel.send("This bot contains pictures for these animals:\n```\ncat, fox, bird, dog, bunny, lizard, owl, tiger, shiba, lion, duck, panda, and penguin\n```")
  }


  if(command === "verify"){
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    let verified = message.guild.roles.find(role => role.name === "Verified");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.addRole(verified).catch(console.error);
    message.channel.send("Successfully verified " + person.user.tag)
  }

  if(command === "unverify"){
    if(!message.member.roles.some(r=>["Support", "Moderator", "Administrator", "Leader"].includes(r.name)) || message.member.hasPermission("ADMINISTRATOR"))
      return
    let verified = message.guild.roles.find(role => role.name === "Verified");
    let person = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!person)
      return message.reply("You must mention a user or provide their id!")
    person.removeRole(verified).catch(console.error);
    message.channel.send("Successfully unverified " + person.user.tag)
  }

  if(command === "meme"){
    const embed = new Discord.RichEmbed();
    got('https://www.reddit.com/r/dankmemes/random/.json').then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;
        embed.addField(`${memeTitle}`, `[View thread](${memeUrl})`);
        embed.setColor(16711680)
        embed.setImage(memeImage);
        embed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`);
        message.channel.send(embed)
            .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
        console.log('Bot responded with: ' + memeImage);
    }).catch(console.error);
  }

  if (command === "eval") {
    if(config.eval.some(user => user === message.author.id) === false)
      return message.reply(":warning: You don't have permission to use that command! :warning:")
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

});


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.login(process.env.TOKEN);
