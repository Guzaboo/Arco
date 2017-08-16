# Incognita

Incognita is a modified form of Arco for the Invisible, Inc. Discord server. It is capable of:

1. ### Mathematical Inputs

Messages with a '#' prefix are handled as mathematical inputs by [mathjs](http://mathjs.org/docs/index.html).

2. ### Bulk message deletion

Messages with a '$' prefix are treated as special commands. Currently, the only '$' command is 'sweep'.


## Installation
First, execute ```npm install``` in Incognita's directory. Then, create a file called secrets.json and put a valid token inside.

Your secrets.json should look like:
```
{
  "token": "YOURTOKENHERE",
  "admin": YOURIDHERE,
  "invisibleServerID": "YOURGUILDIDHERE",
  "logChannelID": "YOURLOGCHANNELIDHERE"
}
```
YOURTOKENHERE: A token from the [Discord developer site](https://discordapp.com/developers).

YOURIDHERE: Your user ID (or the user ID of your bot admin). Incognita will only respond to '$' commands issued by a user with a matching ID.

YOURGUILDHERE: The ID of the guild you want Incognita to operate in.

YOURLOGCHANNELIDHERE: The ID of a text channel to be used by Incognita for logging. Must be within the guild matching YOURGUILDHERE

## Execution
To run Incognita, execute ```nodemon``` in its directory.
