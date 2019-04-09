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

const hive = require('hive-api')

/* Average top points cache, resets once per day */
let cache = {
    data: {},
    cachedAt: 0
}

function resetCache() {
    let promises = []
    hive.GameTypes.list.forEach(gameType => {
        promises.push(new hive.Leaderboard(gameType).load(0, 20).then(lb /* Map<number, LeaderboardPlace> */ => {
            let sum = 0
            lb.forEach((place, index) => {
                sum += place.points
            })
            cache.data[gameType.id] = sum / 20
        })
            .catch(e => { }))
    })
    return promises
}

function handleReq(req, res) {
    if (!req.params.uuid) {
        res.sendStatus(400)
        return
    }

    if (new Date().getTime() - cache.cachedAt > 3600 * 1000 * 24) {
        let resetJob = resetCache()
        Promise.all(resetJob).then(() => {
            cache.cachedAt = new Date().getTime()
        })
    }

    let promises = []
    let data = new Map()

    hive.GameTypes.list.forEach(gameType => {
        promises.push(new hive.Player(req.params.uuid).gameInfo(gameType).then(info => {
            data.set(gameType.id, info.points / cache.data[gameType.id])
        }))
    })

    Promise.all(promises).then(() => {
        let sorting = Array.from(data)
        sorting.sort(function (x, y) {
            return x[1] - y[1]
        })
        let sorted = new Map(sorting)
        let obj = Object.create(null)
        for (let [k, v] of sorted) {
            obj[k] = v
        }

        res.status(200).json({ data: obj, cache: cache.cachedAt + 3600 * 1000 * 24 })
    })
}

module.exports = handleReq
