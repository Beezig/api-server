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

const atob = require('atob')
const FirebaseAdmin = require('firebase-admin')

const config = {
    databaseURL: process.env.FIREBASE_DB,
    credential: FirebaseAdmin.credential.cert(JSON.parse(atob(process.env.FIREBASE_JSON)))
}

FirebaseAdmin.initializeApp(config)

const db = FirebaseAdmin.database()

function putIfAbsent(uuid, platform) {
    let ref = db.ref(`users/${uuid}`)
    ref.once('value', (snapshot) => {
        if (!snapshot.exists()) {
            ref.set({
                uuid: uuid,
                role: 'USER',
                firstTrackedPlatform: platform,
                firstTrackedAt: new Date().getTime()
            })
        }
    })
}

function getUniqueCount(res) {
    var ref = db.ref('users')
    ref.once('value', (snapshot) => {
        res.status(200).json({
            unique_count: snapshot.numChildren()
        })
    })
}

function getUserProfile(uuid, res) {
    var ref = db.ref(`users/${uuid}`)
    ref.once('value', (snapshot) => {
        if (snapshot.exists()) {
            res.status(200).json(snapshot.val())
        } else {
            res.status(404).json({
                code: 404,
                message: 'Player not found.'
            })
        }
    })
}

module.exports = {
    put: putIfAbsent,
    unique: getUniqueCount,
    profile: getUserProfile
}
