<!--
 Copyright (C) 2019 Beezig Team (RoccoDev, ItsNiklass)
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

All real-time communication is done via **WebSockets**.  
Data is transmitted as JSON with this schema:
```json
{
    "opcode": Integer,
    "data": Any,
    "...": ... // (only allowed in server-bound packets)
}
```
The `opcode` defines the packet itself, therefore its purpose.  

# List of operation codes
Opcodes are often found in their hexadecimal notation (e.g, `0x00`).  
Based on the first hexadecimal digit, we can distinguish between:
* `C`: **Client-bound** (sent by the server) opcodes
* `0`: **Server-bound** (sent by the client) opcodes

## Client-bound opcodes
### `00` Error
The server encountered an error and could not parse the request.
```json
{
    "opcode": 3072, /* 0xC00 */
    "data": "The action failed."
}
```
### `01` Online users
The number of users that are currently online.
```json
{
    "opcode": 3073, /* 0xC01 */
    "data": 25
}
```
### `02` Refetch all resources
Tells the client to refetch all remotely-fetched resources (maps, announcements etc.).
```json
{
    "opcode": 3074, /* 0xC02 */
    "data": {}
}
```
### `03` New announcement
Tells the client to display the announcement. A sound will be played as well.
```json
{
    "opcode": 3075, /* 0xC03 */
    "data": {
        "title": "New announcement",
        "content": "This is an announcement."
    }
}
```

## Server-bound opcodes
### `01` Identification
The clients sends this packet immediately after establishing a connection.
```json
{
    "opcode": 1, /* 0x001 */
    "data": {},
    "ua": "Beezig/6.0.0 [...]",
    "uuid": "bba224a20bff4913b04227ca3b60973f",
    "name": "RoccoDev",
    "platform": "5zig"
}
```
### `02` Request online users
A [(C) 01 - Online users](#01-online-users) packet will follow as a response.
```json
{
    "opcode": 2, /* 0x002 */
    "data": {}
}
```
### `03` BeezigForge loaded
Sent when BeezigForge classes get loaded (after joining a world).
```json
{
    "opcode": 3, /* 0x003 */
    "data": {}
}
```
