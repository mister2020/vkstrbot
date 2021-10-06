const { VK, MessagesReadContext } = require('vk-io');
const commands = [];
const request = require('prequest');

let users = require('./database/users.json');
let buttons = [];

const ownerId = 539557764;

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


const vk = new VK({
	token: '4e28f6127cc070ade050a649aec4783de6e7db8a151a6728574ea25a366bf1cbd3b70ec0e259c0a80d95f'
});
const { updates, snippets } = vk;

updates.startPolling();
updates.on('message', async (message) => {
	if(Number(message.senderId) <= 0) return;

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
			regDate: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
			ignore: []
		});
		console.log(` +1 игрок [Игроков: ${users.length}]`);
		console.log(``);
		saveUsers();
	}

	message.user = users.find(x=> x.id === message.senderId);

	const bot = (text, params) => {
		return message.send(`${message.user.mention ? `@id${message.user.id} (${message.user.tag})` : `${message.user.tag}`}, ${text}`, params);
	}

	const command = commands.find(x=> x[0].test(message.text));

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


cmd.hear(/^(?:.игнор|.и)$/i, async (message, bot) => {
	if(message.senderId !== 539557764) return;

	message.loadMessagePayload()
	const replyMessage = message.replyMessage;
	const msgId = replyMessage.conversationMessageId;

	let res = await vk.api.messages.getByConversationMessageId({
		peer_id: message.peerId,
		conversation_message_ids: msgId
	});

	let userInfo = await vk.api.users.get({
		user_ids: res.items[0].from_id
	});

	let user = message.user.ignore.find(x => x.id === userInfo[0].id);

	if(!user){
		message.user.ignore.push({
			"id": userInfo[0].id,
			"firstName": userInfo[0].first_name,
			"lastName": userInfo[0].last_name,
			"mute": true
		});
	}else{
		user.mute = true;
	}

	let text = `Пользователь [id${userInfo[0].id}|${userInfo[0].first_name} ${userInfo[0].last_name}] добавлен в игнор-лист.`;

	await vk.api.messages.edit({
		peer_id: message.peerId,
		message_id: message.id,
		message: text
	});

});

cmd.hear(/^(?:.анигнор|.аи)$/i, async (message, bot) => {
	if(message.senderId !== 539557764) return;

	message.loadMessagePayload()
	const replyMessage = message.replyMessage;
	const msgId = replyMessage.conversationMessageId;

	let res = await vk.api.messages.getByConversationMessageId({
		peer_id: message.peerId,
		conversation_message_ids: msgId
	});

	let userInfo = await vk.api.users.get({
		user_ids: res.items[0].from_id
	});

	let user = message.user.ignore.find(x => x.id === userInfo[0].id);
	user.mute = false;

	let text = `Пользователь [id${userInfo[0].id}|${userInfo[0].first_name} ${userInfo[0].last_name}] убран из игнор-листа.`;

	await vk.api.messages.edit({
		peer_id: message.peerId,
		message_id: message.id,
		message: text
	});

});


cmd.hear(/^(.*)$/i, async (message, bot) => {
	console.log(message);
	let owner = users.find(x => x.id === ownerId);
	let user = owner.ignore.find(x => x.id === message.senderId);


	if(user.mute === true){
		vk.api.messages.delete({
			conversation_message_ids: message.conversationMessageId,
			delete_for_all: 0,
			peer_id: message.peerId
		});
	}else{
		return;
	}
});

