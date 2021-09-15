'use strict';
const ImageSearchAPIClient = require('@azure/cognitiveservices-imagesearch');
const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;
const { VK } = require('vk-io');
const commands = [];
const request = require('prequest');
const BingImageSearchStream = require('bing-image-search-stream');
let https = require('https');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
var jQuery;
var $ = jQuery = require('jquery')(window);


let users = require('./database/users.json');
let dialogs = require('./database/dialogs.json');
let config = require('./database/settings.json');
let buttons = [];

setInterval(async () => {
	await saveUsers();
	console.log(' База данных успешно сохранена.');
	console.log('');
}, 30000);

async function saveUsers()
{
	require('fs').writeFileSync('./database/users.json', JSON.stringify(users, null, '\t'));
	return true;
}

async function saveDialogs()
{
	require('fs').writeFileSync('./database/dialogs.json', JSON.stringify(dialogs, null, '\t'));
	return true;
}

setInterval(async () => {
	await saveUsers();
	await saveDialogs();
	console.log(' База данных успешно сохранена.');
	console.log('');
}, 30000);


const vk = new VK({
	token: config.grouptoken,
	pollingGroupId: config.groupid
});

const uvk = new VK({
	token: '21de54231e8f130ea2a3bb2e9fb3c95390fcf5d665130934f453d7b7dc5b2ccc39820f79d513185a44a90'
});
const { updates, snippets } = vk;

updates.startPolling();
updates.on('message', async (message) => {
	if(Number(message.senderId) <= 0) return;
	if (/\[public204786036\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[public204786036\|(.*)\]/ig, '').trim();

	if(!users.find(x=> x.id === message.senderId))
	{
		const [user_info] = await vk.api.users.get({ user_id: message.senderId });
		const date = new Date();

		users.push({
			int1: 0,
			int2: 0,
			int3: 0,
			int4: 0,
			int5: 0,
			int6: 0,
			int7: 0,
			int8: 0,
			int9: 0,
			int10: 0,
			id: message.senderId,
			uid: users.length,
			balance: 50,
			bank: 0,
			btc: 0,
			farm_btc: 0,
			farms: 0,
			farmslimit: 200,
			energy: 10,
			opit: 0,
			biz: 0,
			zhelezo: 0,
			zoloto: 0,
			almaz: 0,
			bizlvl: 0,
			nicklimit: 16,
			rating: 0,
			regDate: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
			mention: true,
			ban: false,
			timers: {
				hasWorked: false,
				bonus: false,
				poxod: false,
				poxod2: false,
				kopat: false,
				hack: false
			},
			tag: user_info.first_name,
			work: 0,
			business: 0,
			notifications: true,
			exp: 1,
			level: 1,
			referal: null,
			promo: false,
			transport: {
				car: 0,
				yacht: 0,
				airplane: 0,
				helicopter: 0
			},
			realty: {
				home: 0,
				apartment: 0
			},
			misc: {
				phone: 0,
				farm: 0,
				pet: 0,
			},
			settings: {
				firstmsg: true,
				adm: 0,
				trade: true,
				old: false,
				limit: 1000000,
			},
			pet: {
				lvl: 0,
				poterl: false
			},
			marriage: {
				partner: 0,
				requests: []
			}
		});
		console.log(` +1 игрок [Игроков: ${users.length}]`);
		console.log(``);
		saveUsers();
	}

	message.user = users.find(x=> x.id === message.senderId);

	const bot = (text, params) => {
		return message.send(`${message.user.mention ? `@id${message.user.id} (${message.user.tag})` : `${message.user.tag}`}, ${text}`, params);
	}

	if(message.user.ban) return bot(`ваш аккаунт заблокирован ⛔`);

	const command = commands.find(x=> x[0].test(message.text));

	if(message.user.settings.firstmsg)
	{


		message.user.settings.firstmsg = false;


		saveUsers();
		return;

	}


	if(message.user.exp >= 24)
	{
		message.user.exp = 1;
		message.user.level += 1;
	}

	message.args = message.text.match(command[0]);
	await command[1](message, bot);

	saveUsers();
	console.log(` Введена команда: ${message.text}.`)
	console.log(``)
});

const cmd = {
	hear: (p, f) => {
		commands.push([p, f]);
	}
}

cmd.hear(/^(?:s)\s(.*)$/i, async (message, bot) => {
	if(Number(message.senderId) !== 539557764) return;

	let text = message.args[1];

	let res = 0;

	let mes = await vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), peer_ids: 2000000000 + message.chatId, message: '.'});
	res = Number(mes[0].conversation_message_id);

	let i = 1;
	let en = text[0];
	while(i < text.length + 1){
		await sleep(2000);
		vk.api.messages.edit({ peer_id: 2000000000 + message.chatId, message: en, conversation_message_id: res});
		en += text[i];
		i++;
	}


});

cmd.hear(/^(?:d)\s(.*)\s(.*)$/i, async (message, bot) => {
	if(Number(message.senderId) !== 539557764) return;

	let text1 = message.args[1];
	let text2 = message.args[2];

	let res = 0;

	let mes = await vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), peer_ids: 2000000000 + message.chatId, message: '.'});
	res = Number(mes[0].conversation_message_id);

	let i = 1;
	while(i < 10){
		vk.api.messages.edit({ peer_id: 2000000000 + message.chatId, message: text1, conversation_message_id: res});
		vk.api.messages.edit({ peer_id: 2000000000 + message.chatId, message: text2, conversation_message_id: res});
		i++;
	}

	vk.api.messages.edit({ peer_id: 2000000000 + message.chatId, message: '.', conversation_message_id: res});


});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function getRandomFloat(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

async function invite() {
	uvk.api.call('messages.sendVoipEvent', {peer_id: 200000010, message: {message: 'test'}});
}
