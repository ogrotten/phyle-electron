const dbmgr = require('./dbmgr')
const pb = dbmgr.pb

// const allTags = db.prepare('SELECT rowid,name,data,type FROM tags').all()

// const allTags = pb.collection('tags').getFullList(200 /* batch size */, {
// 	sort: 'tag',
// })

async function getTags() {
	allTags = await pb.collection('tags').getFullList(200 /* batch size */, {
		sort: 'tag',
	})
	return allTags.map((t) => ({ ...t, in: false }))
}
let allTags = getTags()

exports.autoTag = async (incoming) => {
	if (!incoming) return

	const toMatch = new RegExp(`(${allTags.map((e) => e.data).join('|')})`, 'ig')

	incoming.forEach((e) => {
		e.tags_auto = '0'

		const hold = e.name.toLowerCase().match(toMatch)
		if (!hold) return

		// console.log(`conlog: hold`, hold)
		const tagIds = allTags
			.filter((tag) => {
				console.log(`conlog: hold`, hold, tag.data)
				return hold?.includes(tag.data)
			})
			.map((e) => e.rowid)

		console.log(`conlog: tagIds`, tagIds)

		// e.tags_auto = Array.from(hold).join(',')
		e.tags_auto = tagIds.join('|')
	})

	return incoming
}

exports.allTags = allTags
exports.getTags = getTags
