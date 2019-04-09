// Copyright (C) 2019 Beezig Team (RoccoDev, ItsNiklass)
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const Discord = require('discord.js')
const ws = require('../../ws/server.js')

const hookId = process.env.REPORTS_HOOK_ID
const hookKey = process.env.REPORTS_HOOK_KEY
const modRole = process.env.REPORTS_MOD_ROLE

const hook = new Discord.WebhookClient(hookId, hookKey)

module.exports = (req, res) => {
    /* Prevent sending reports without Beezig */
    if (!req.headers['user-agent'].startsWith('Beezig/')) {
        res.status(403).send('You need to be using Beezig!')
        return
    }

    let sender = req.body.sender
    let reason = req.body.reason
    let target = req.body.destination

    /* Instantly release connection to the client */
    res.sendStatus(200)

    let targets = ''
    target.split(',').forEach(player => {
        targets += `\`${player}\`, `
    })
    targets = targets.trim()

    let fieldTargets = {
        name: 'Reported Player(s)',
        value: targets.substring(0, targets.length - 1),
        inline: false
    }

    reason = reason.replace(/,/g, ', ')

    let fieldReason = {
        name: 'Reason',
        value: reason,
        inline: false
    }

    let fields = [fieldTargets, fieldReason]

    let embed = {
        fields: fields,
        color: require('../../utils/colors.js').REPORT_NEW,
        footer: {
            text: 'Powered by Beezig',
            icon_url: 'https://cdn.discordapp.com/icons/346695724253184014/b6c64a02092ce9090b5530092da3014d.png'
        }
    }

    let message = `\`${sender}\` is looking for a <@&${modRole}>`

    hook.send(message, {
        embeds: [embed]
    }).catch(require('../../utils/errors.js'))

    ws.broadcast({
        opcode: 0xC04,
        data: {
            target: fieldTargets.value.replace(/`/g, ''),
            reason: reason
        }
    })
}
