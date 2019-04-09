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

class Connection {
    constructor (uuid, entity) {
        this.uuid = uuid
        this.entity = entity
    }

    send(object) {
        if (this.entity.readyState === 1) {
            this.entity.send(JSON.stringify(object))
        }
    }

    toJSON() {
        return {
            uuid: this.uuid,
            name: this.name,
            ua: this.ua,
            beezigforge: this.beezigforge,
            connectedAt: this.connectedSince
        }
    }
}

module.exports = Connection
