// Copyright (C) 2019 Beezig Team (RoccoDev, ItsNiklass)
// 
// This file is part of "Beezig API Server".
// 
// "Beezig API Server" is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// "Beezig API Server" is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with "Beezig API Server".  If not, see <http://www.gnu.org/licenses/>.

/* Eris is our Discord framework */
const Eris = require('eris')

/* Retrieve the token from environment */
const token = process.env.BOT_TOKEN

/* Init bot */
const bot = new Eris(token)
bot.on('error', require('../../utils/errors.js'))
bot.connect()

/* Our route function */
module.exports = (req, res) => {
    let matchId = req.params.id

    let guildId = process.env.BOT_GUILD_ID
    let guild = bot.guilds.get(guildId)

    let members = guild.members

    let memberFound = members.find(m => m.id === matchId)

    res.sendStatus(memberFound ? 302 : 404)
}
