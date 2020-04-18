const fs = require('fs')
const config = require('./config')
const fetch = require('node-fetch')
const translations = [
	'ca4966f1c2',//'en',
]

translations.map((webhookKey) => SyncTerms(webhookKey))

async function SyncTerms (webhookKey) {
	try {
		const res = await fetch(`https://api.poeditor.com/webhooks/${webhookKey}`)
		console.info(`${webhookKey} was synced`)
	} catch (err) {
		console.error(`Syncing was failed for ${webhookKey} language. Error ${err}`)
	}
}
