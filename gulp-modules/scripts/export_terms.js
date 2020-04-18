const fs = require('fs')
const config = require('./config')
const fetch = require('node-fetch')
const translations = [
	'7c42f6dc10',//'en',
	'0a81916757',//'de',
]

translations.map((webhookKey) => ExportTerms(webhookKey))

async function ExportTerms (webhookKey) {
	try {
		const res = await fetch(`https://api.poeditor.com/webhooks/${webhookKey}`)
		console.info(`${webhookKey} was exported to Github`)
	} catch (err) {
		console.error(`Exporting was failed for ${webhookKey} language. Error ${err}`)
	}
}
