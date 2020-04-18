const fs = require('fs')
const config = require('./config')
const fetch = require('node-fetch')
const translations = [
	'97336d76c6',//'en',
	'0723b3170b',//'de',
]

translations.map((webhookKey) => ImportTerms(webhookKey))

async function ImportTerms (webhookKey) {
	try {
		const res = await fetch(`https://api.poeditor.com/webhooks/${webhookKey}`)
		console.info(`${webhookKey} was imported to POeditor`)
	} catch (err) {
		console.error(`Importing was failed for ${webhookKey} language. Error ${err}`)
	}
}
