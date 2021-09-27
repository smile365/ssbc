const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const muri = process.env.MONGO_URL

let torrentdb = null
let nextTorrentId = 0
console.log(muri)
MongoClient.connect(`${muri}/admin`, {useNewUrlParser: true}, (err, mconn) => {
    if(err) {
        console.error(err)
        process.exit(1)
    }
    torrentdb = mconn.db('torrent')
    torrentdb.collection('log').createIndex({date: 1, reqs: -1})
    torrentdb.collection('log').createIndex({hash: 1})
    torrentdb.collection('hash').createIndex({hash: 1}, {unique: 1})
    torrentdb.collection('hash').find().sort({_id: -1}).limit(1).next((err, r) => {
        nextTorrentId = (r && r._id || 0) + 1
        console.log('Next torrent _id is', nextTorrentId, 'tableCaption', process.env.TABLE_CAPTION)
    })
})

module.exports = {
  torrentdb: torrentdb
}
