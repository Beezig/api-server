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

module.exports = (app) => {
    let users = require('./routes/users.js')
    app.get('/users/online', users.online)
    app.get('/users/data', users.data)
    app.get('/users/data/:uuid', users.dataSpecific)

    app.get('/bestgame/:uuid', require('./routes/bestgame.js'))

    app.get('/maprecords/:uuid', require('./routes/speedrun.js'))

    /* Admin routes */
    let admin = require('./routes/admin.js')
    let auth = admin.check

    app.post('/admin/refetch', [auth], admin.refetch)
    app.post('/admin/announce', [auth], admin.announce)

    app.post('/report', require('./routes/report.js'))

    app.get('/discord/check/:id', require('./routes/discord.js'))
}
