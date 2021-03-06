const Discord = require('discord.js'),
  client = new Discord.Client(),
  math = require('mathjs'),
  parser = math.parser(),
  Profane = require('profane'),
  censor = new Profane(),
  randomWord = require('random-word'),
  wordDefine = require('word-definition'),
  fs = require('fs'),
  http = require('http'),
  exec = require('child_process').exec

math.import({
  'import':     function () { throw new Error('Import is disabled')     },
  'createUnit': function () { throw new Error('CreateUnit is disabled') },
  'eval':       function () { throw new Error('Eval is disabled')       },
  'parse':      function () { throw new Error('Parse is disabled')      },
  'simplify':   function () { throw new Error('Simplify is disabled')   },
  'derivative': function () { throw new Error('Derivative is disabled') }
}, { override: true })

const config = JSON.parse(fs.readFileSync('secrets.json'))

const ballResp = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes definitely',
  'You may rely on it',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Reply hazy try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  'Don\'t count on it',
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful'
]

let publicIP = {},
  ipServer,
  ipChannel

const englishWords = JSON.parse(fs.readFileSync('randwords.txt'))

fs.exists('publicIP.json', function (exists) {
  if (!exists) {
    fs.writeFileSync('publicIP.json', JSON.stringify({ 'ip': null }), { flag: 'w' }, function (err) {
      if (err) throw err
      console.log('IP json created.')
    })
  }
})


client.on('ready', () => {
  console.log('0x526561647921')

  console.log(config.ipServerID)
  ipServer = client.guilds.get(config.ipServerID)
  console.log('Located guild: ' + ipServer.name)
  ipChannel = ipServer.channels.get(config.ipChannelID)
  console.log('Located IP channel: ' + ipChannel.name)

  checkIPChange(publicIP)
  
  let d = Math.round((new Date().getTime() - 1516492800000/*milliseconds since 1/1/1970 on 1/21/2018*/) / 86400000/*milliseconds in one day*/ + 1)
  console.log("Currently censoring " + d + "random words.");
})

client.on('disconnect', event => {
  console.log('!Disconnected: ' + event.reason + ' (' + event.code + ')!')
})


// Public IP checker
let interval = 5 * 60 * 1000
setInterval(checkIPChange, interval, publicIP)



client.on('message', message => {
  console.log('\n' + Date() + ' | ' + message.author.username + ': ' + message.content)
  console.log('Channel Name: ' + message.channel.name)
  const messageSplit = message.content.split(' ')

  let date = new Date()
  console.log('Hours: ' + date.getHours())
  if (date.getHours() >= 22 || date.getHours() < 6) {
    message.react('🅱')
      .then(() => message.react('🇪')
        .then(() => message.react('🇩')
          .then(() => message.react('🛏')
          )
        )
      )
  }
  console.log('Output of plain censor: ' + JSON.stringify(censor.getCategoryCounts(message.content)))

  for (let i = 0; i < messageSplit.length; i++) {
    let simpleWord = messageSplit[i].replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,'').replace(/\s{2,}/g,' ').toLowerCase().replace(/0|&#1086;/gi,'o').replace(/1/gi,'i').replace(' ', '')
    let notSimpleWord = simpleWord.replace(/[^\w\s]|(.)(?=\1)/gi, '')
    console.log('Checking: ' + messageSplit[i])
    console.log('Simplified: ' + simpleWord)
    
    let profane = (censor.hasWord(simpleWord || notSimpleWord) || englishWords.indexOf(simpleWord) != 1 && englishWords.indexOf(simpleWord) < d || englishWords.indexOf(notSimpleWord) != 1 && englishWords.indexOf(notSimpleWord) < d)
    
    console.log('Has profanity: ' + profane)
    
    let d = Math.round((new Date().getTime() - 1516492800000) / 86400000 + 1)
    
    
    if (profane) {
      message.react('🛑')
      message.reply({'content': '🚫 ¡LANGUAGE CENSORSHIP! 🚫', 'embed': {
        'title': '¡LANGUAGE CENSORSHIP!',
        'description': '"' + messageSplit[i].replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,'').replace(/\s{2,}/g,' ') + '" is a bad word. Don\'t use it. >:(',
        'color': 0xff0000,
        'footer': {
          'text': 'Glory to LEARAX57H'
        },
        'image': {
          'url': 'https://getadblock.com/images/adblock_logo_stripe_test.png'
        }
      }
      }).then(m => {
        delay(5000)
        m.delete()
      })
      break
    }
  }



  if (message.author.username == 'Guzaboo') {
    if (message.content.charAt(message.content.length - 1) === '?') {
      message.react('🤔')
    } else message.react('🙅')
  }

  if (!message.author.bot) {
    if (message.content.charAt(0) == '#') {
      console.log('////MATH TIME////')
      let mathInput = message.content.slice(1)
      console.log('Input: ' + mathInput)

      message.delete()

      try {
        message.channel.send(mathInput + ' returns ' + parser.eval(mathInput))
      } catch (err) {
        message.channel.send(mathInput + ' errored with ' + err)
      }


    } else if (message.content.charAt(0) == '?') {
      switch (messageSplit[0].slice(1)) {
      case 'fortune':
        console.log('The future hates you')
        exec('fortune -s', {maxBuffer: 1024 * 2000}, (err, stdout) => {
          if (err) {
            console.log('Error encountered: ' + err)
          }

          message.channel.send(stdout.match(/[\s\S]{1,1999}/) || [], {'code': true})

          message.delete()
        })
        break

      case 'forune':
        console.log('Regret\'s my name')
        exec('fortune forune', {maxBuffer: 1024 * 2000}, (err, stdout) => {
          if (err) {
            console.log('Error encountered: ' + err)
          }

          message.channel.send(stdout.match(/[\s\S]{1,1999}/) || [], {'code': true})

          message.delete()
        })
        break

      case 'word': {
        console.log('Wordin\'')
        let word = randomWord()
        wordDefine.getDef(word, 'en', null, function(definition) {

          message.channel.send({ 'embed': {
            'title': word.charAt(0).toUpperCase() + word.slice(1),
            'description': definition.definition || 'No definition found.',
            'author': {
              'name': client.user.username,
              'icon_url': 'http://icons.veryicon.com/png/System/Simple%202/accessories%20dictionary.png'
            },
            'color': 0xe14b57,
            'footer': {
              'text': 'Inspired by ' + message.author.username
            }
          }})
        })

        message.delete()
        break
      }

      case 'define':
        console.log('Definin\'')
        wordDefine.getDef(messageSplit[1], 'en', null, function(definition) {

          message.channel.send({ 'embed': {
            'title': messageSplit[1].charAt(0).toUpperCase() + messageSplit[1].slice(1),
            'description': definition.definition || 'No definition found.',
            'author': {
              'name': client.user.username,
              'icon_url': 'http://icons.veryicon.com/png/System/Simple%202/accessories%20dictionary.png'
            },
            'color': 0xe14b57,
            'footer': {
              'text': 'Word directly provided by ' + message.author.username
            }
          }})
        })

        message.delete()
        break
      }
    } else if (message.content.substring(0, 2) == '🎱') {
      console.log('8ballin\'')
      message.channel.send({ 'embed': {
        'title': message.cleanContent.slice(2),
        'description': ballResp[Math.floor(Math.random() * ballResp.length)],
        'author': {
          'name': client.user.username,
          'icon_url': 'http://www.iconninja.com/files/776/590/392/ball-icon.png'
        },
        'color': 0x000000,
        'footer': {
          'text': 'Asked by ' + message.author.username
        }
      }})
      message.delete()

    } else if (message.author.id == config.admin && message.content.charAt(0) == '$') {
      let adminCommand = message.content.slice(1).split(' ')
      console.log('Admin Command Issued: ' + adminCommand)

      switch (adminCommand[0]) {
      case 'sweep':
        switch (adminCommand[1]) {
        case 'content':
          message.channel.fetchMessages({limit:100}).then(messages => {
            let sweepTargetContent = adminCommand.splice(2).join(' ')
            console.log('Sweeping chat for messages matching ' + sweepTargetContent + '...')

            let Victims = messages.filter(message => message.content.includes(sweepTargetContent))

            message.channel.bulkDelete(Victims)
          })
          break

        case 'charAt':
          console.log('Sweeping chat for messages with a \'' + adminCommand[3] +
            '\' character in the ' + adminCommand[2] + 'position...')

          message.channel.fetchMessages({limit:100}).then(messages => {
            let Victims = messages.filter(message => message.content.charAt(adminCommand[2]) == adminCommand[3])

            message.channel.bulkDelete(Victims)
          })
          break

        case 'author': {
          let sweepTargetUser = adminCommand.splice(2).join(' ')
          console.log('Sweeping chat for messages from ' + sweepTargetUser + '...')

          message.channel.fetchMessages({limit:100}).then(messages => {

            let Victims = messages.filter(message => message.author.username == sweepTargetUser)

            message.channel.bulkDelete(Victims)
          })
          break
        }

        default:
          if (adminCommand[1] != undefined) {
            console.log('Sweeping chat for ' + adminCommand[1] + ' messages...')
          } else console.log('Removing past 100 messages...')

          message.channel.fetchMessages({limit:adminCommand[1]}).then(messages => {
            let Victims = messages

            message.channel.bulkDelete(Victims)
          })
          break
        }
      }
    }
  }
})


function delay(milliseconds) {
  let start = new Date().getTime()

  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break
    }
  }
}

function parsePublicIP() {
  return JSON.parse(fs.readFileSync('publicIP.json', 'utf8'))
}

function checkIPChange(publicIP) {
  console.log('Checking if public IP has changed...')

  publicIP = parsePublicIP()

  let oldIP = publicIP.ip

  http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function (resp) {
    resp.on('data', function (newIP) {
      if (newIP != oldIP) {
        console.log('IP changed; new IP: ' + newIP)

        if (publicIP.ip != undefined) {
          console.log('Deleting old IP message...')

          ipChannel.fetchMessage(publicIP.toPurgeID).then( msg => {

            console.log('Isolated message to be removed.')

            console.log('Message to be deleted: ' + msg.content)
            msg.delete()
            console.log('Old IP message deleted!')
          })
        }

        publicIP.ip = newIP.toString()

        ipChannel.send({embed: {
          author: {
            name: 'Network Monitor',
            icon_url: 'https://maxcdn.icons8.com/Share/icon/Mobile/cellular_network1600.png'
          },
          color: 0xf46242,
          fields: [
            {
              name: 'Server IP:',
              value: '`' + newIP + '`',
              inline: true
            }
          ],
        }
        }).then( msg => {
          msg.pin()

          publicIP.toPurgeID = msg.id
          console.log('Purge details saved.')
          fs.writeFileSync('publicIP.json', JSON.stringify(publicIP), 'utf8')
        })

      } else console.log('It hasn\'t.')
    })
  }).on('error', function (err) {
    console.log('Failure to connect: ' + err)
  })
}

client.login(config.token)
