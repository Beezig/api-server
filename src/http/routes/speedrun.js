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

const DeathrunMapsUrl = 'https://roccodev.pw/beezighosting/files/dr.json'
const Request = require('request')
const HiveAPI = require('hive-api')

const SpeedrunAPI = new (require('speedrunapi'))()
const gameId = '369ep8dl'
const categoryId = '824xzvmd'

/* Map data cache */
let CachedWR = {}
let cachedAt = 0

const cacheTime = 3600000

function run(req, toRes, dr) {
    /* Reset cache */
    if (cachedAt === 0 || ((new Date().getTime() - cachedAt) > cacheTime)) {
        cachedAt = new Date().getTime()
        Request({
            url: DeathrunMapsUrl,
            json: true
        }, async (err, res, body) => {
            if (!err && res.statusCode === 200) {
                let maps = {}

                Object.keys(body).forEach(key => {
                    let map = body[key]
                    maps[map.api] = map.speedrun
                })

                let promises = []

                Object.keys(dr).forEach(drMap => {
                    promises.push(SpeedrunAPI.leaderboards(gameId, categoryId, maps[drMap]).exec())
                })

                Promise.all(promises).then(results => {
                    let timesFull = {}
                    let personalTimes = {}

                    results.forEach(time => {
                        let value = time.items.runs[0].run.times.primary_t
                        let mapName = Object.keys(maps).find(key => maps[key] === time.items.level)

                        timesFull[mapName] = value
                        personalTimes[mapName] = dr[mapName] - value
                    })

                    CachedWR = timesFull
                    toRes.status(200).json({
                        times: personalTimes,
                        cachedAt: cachedAt + cacheTime
                    })
                })
            }
        })
    } else {
        let response = {
            cachedUntil: cachedAt + cacheTime,
            times: {}
        }

        Object.keys(dr).forEach(map => {
            let time = CachedWR[map]
            response.times[map] = dr[map] - time
        })

        toRes.status(200).json(response)
    }
}

module.exports = (req, res) => {
    let uuid = req.params.uuid
    let player = new HiveAPI.Player(uuid)

    player.gameInfo(HiveAPI.GameTypes.DR).then(dr => {
        run(req, res, dr.mapRecords)
    })
}
