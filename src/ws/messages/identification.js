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

const Message = require('../message.js')
const putIntoFirebase = require('../../utils/firebase.js').put

class Identification extends Message {
    call(data, connection) {
        connection.uuid = data.uuid
        connection.name = data.name
        connection.agent = data.ua
        connection.platform = data.platform
        connection.connectedSince = new Date().getTime()

        putIntoFirebase(data.uuid, data.platform)
    }

    opcode() {
        return 0x001
    }
}

module.exports = Identification
