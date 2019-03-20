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

const Express = require('express')
const app = Express()

const ws = require('./ws/server.js')

/* Set up CORS */
app.use(require('cors')())

/* We use body-parser to accept JSON input in POST requests */
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* Set up routes */
require('./http/route.js')(app)

ws.register()
ws.connect(app)
