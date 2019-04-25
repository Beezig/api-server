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

const firebase = require('../../utils/firebase.js')

function online(req, res) {
    let pool = require('../../ws/server.js').pool
    res.status(200).json(pool)
}

function data(req, res) {
    firebase.unique(res)
}

function dataSpecific(req, res) {
    firebase.profile(req.params.uuid, res)
}

module.exports = {
    online: online,
    data: data,
    dataSpecific: dataSpecific
}
