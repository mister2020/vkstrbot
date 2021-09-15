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
	token: '047645cace2aaf3702fb7fb3f88ccaa9c9802db9f9676637b97b00f39b51baafdee8495e2a46274d49779'
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

cmd.hear(/^(?:помощь|команды|📚 Помощь|меню|help|commands|cmds|menu|start|@destinybot 📚 Помощь)$/i, async (message, bot) => {
	await bot(`мои команды:

-бебра
-играть
-бот [текст]
-qr [текст/ссылка]
-сократить [ссылка]
-цвет [фото]
-лицо [фото]
-ft [text]
-найти [фото]`, );
{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "🔑 Бонус"
		},
			"color": "positive"
		}]
		]
			})
		};
});

cmd.hear(/^(?:бебра)$/i, async (message, bot) => {
	bot(`бебра`,
	{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "бебра"
		},
			"color": "positive"
		}]
	],
		"inline": true
	})
		});
});

cmd.hear(/^(?:квест)$/i, async (message, bot) => {
	message.send(`Поздравляем, Вы Прошли Квест!`);
});

cmd.hear(/^(?:пвпк|ПВПК)$/i, async (message, bot) => {
	message.send(`ПоздравляЕм, вы не бот.

3.1 C. C. A.
https://ru.wikipedia.org/wiki/%D0%9A%D0%B2%D0%B5%D1%81%D1%82`);
});

cmd.hear(/^(?:Colossal Cave Adventure)$/i, async (message, bot) => {
	message.send(`Да вы гений!

1100001
https://vk.com/podnebes_______________________m`);
});

cmd.hear(/^(?:6e6рa)$/i, async (message, bot) => {
	message.send(`Это первый квест, если его кто-то прошел, сделаю что-то нереальное. И да - поздравляю.`);
});

cmd.hear(/^(?:играть)$/i, async (message, bot) => {
bot(`Выберите игру:`,

	{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "Apple of Fortune"
		},
			"color": "positive"
		}]
	],
		"inline": true
	})
		}

);
});

cmd.hear(/^(?:фото)\s(.*)$/i, async (message, bot) => {
	var rq = `${message.args[1]}`;


	const SUBSCRIPTION_KEY = process.env['AZURE_SUBSCRIPTION_KEY'] || 'ed92b3459cd24960806ea3ed6d8fe0c8';
	if (!SUBSCRIPTION_KEY) {
		throw new Error('Missing the AZURE_SUBSCRIPTION_KEY environment variable')
	}
	function bingWebSearch(query) {
		https.get({
			hostname: 'api.bing.microsoft.com',
			path: '/v7.0/images/search?q=' + encodeURIComponent(query),
			headers: { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY },
		}, res => {
			let body = ''
			res.on('data', part => body += part)
			res.on('end', async () => {
				for (var header in res.headers) {
					if (header.startsWith("bingapis-") || header.startsWith("x-msedge-")) {
						console.log(header + ": " + res.headers[header])
					}
				}
				console.log('\nJSON Response:\n')
				//console.dir(JSON.parse(body), { colors: false, depth: null })
				var rs = JSON.parse(body);
				console.log(rs.value[0]);

				if (rs.value.length === 0) return;

				try {
					const last = await uvk.upload.photoAlbum({
						album_id: 278410279,
						source: {
							value: rs.value[0].contentUrl
						}
					});

					let ph = `photo539557764_${last[0].id}`;

					vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), chat_id: message.chatId, attachment: ph });
				} catch (e) {
					let h = 0;
					let r = 1;
					while (h === 0) {
						try {
							const last = await uvk.upload.photoAlbum({
								album_id: 278410279,
								source: {
									value: rs.value[r].contentUrl
								}
							});

							let ph = `photo539557764_${last[0].id}`;

							vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), chat_id: message.chatId, attachment: ph });
							h = 1;
						} catch (e) {
							r++;
						}
                    }
                }


			})
			res.on('error', e => {
				console.log('Error: ' + e.message)
			})
		})
	}
	const query = process.argv[2] || rq
	bingWebSearch(query)

});

cmd.hear(/^(?:фот)\s(.*)$/i, async (message, bot) => {
	var request = `${message.args[1]}`;

	let ht;

	var rand = getRandomFloat(1, 20);



	var API_KEY = '22223717-a92e33662e6406468acefafd6';
	var URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + request;
	$.getJSON(URL, async function (data) {
		if (parseInt(data.totalHits) > 0) {
			$.each(data.hits, function (i, hit) { console.log(hit.largeImageURL); ht = hit.largeImageURL; });

			const last = await uvk.upload.photoAlbum({
				album_id: 278410279,
				source: {
					value: ht
				}
			});

			let ph = `photo539557764_${last[0].id}`;

			//message.send(ph);

			vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), chat_id: message.chatId, attachment: ph });

			console.log(last);

			//message.send(ht);
			//message.sendPhotos(ht);
			/*
			var d = 0;
			var k = 0;
			console.log("\n" + ht);
			while (d === 0) {
				let text = ``;
				text += ht[k];
				//console.log(ht);
				k++;
				if (text[text.length - 1] === 'g' && text[text.length - 2] === 'p' && text[text.length - 3] === 'j') {
					message.send(text);
					d = 1;
				}
			}
			*/
		} else {
			return bot(`не найдено "${request}".`);
			console.log('No hits');
		}
	});

});

cmd.hear(/^(?:тест)$/i, async (message, bot) => {
	const res = getBadApples();
	//const res = getRandomFloat(1, 6);
	console.log(res);
	let text = ``;

	let i = 9;
	while(i !== (-1)){
		text += `${res[i].line}\n`;
		i--;
	}

	message.send(text);
});

cmd.hear(/^(?:бот)\s(.*)$/i, async (message, bot) => {

	console.log(message.args[1]);

	var request = require('request');
	request.post({
	    url: 'https://aiproject.ru/api/',
	    formData: {
					query: JSON.stringify({
						ask: `${message.args[1]}`,
						userid: '654321',
						key: ''
					})
	    },
	}, function(error, response, body) {
		//console.log(JSON.parse(body));
		let res = JSON.parse(body);
	  message.send(res.aiml);
	});

});

cmd.hear(/^(?:тестт)\s(.*)$/i, async (message, bot) => {
	const deepai = require('deepai');
	deepai.setApiKey('7b665286-68cf-4185-8d43-a4c6fb6cbe4b');

	var resp = await deepai.callStandardApi("text-generator", {
					text: message.args[1],
	});
	console.log(resp);
	message.send(resp.output);

});

cmd.hear(/^(?:тест1)$/i, async (message, bot) => {
	const request = require('request');

	const options = {
	  method: 'GET',
	  url: 'https://chartcatcher.p.rapidapi.com/plot',
	  qs: {
	    x: '1,2,3,4,5,6,7,8,9,10',
	    y: '1,4,9,16,25,36,49,64,81,100',
	    xlabel: 'x-axis',
	    ylabel: 'y-axis',
	    style: 'dark',
	    chart: 'barplot'
	  },
	  headers: {
	    'x-rapidapi-key': 'b7023317ebmsh16c26f2debac9e5p1bdb16jsnc55522191187',
	    'x-rapidapi-host': 'chartcatcher.p.rapidapi.com',
	    useQueryString: true
	  }
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		console.log(JSON.parse(body));
	});


});

cmd.hear(/^(?:qr)\s(.*)$/i, async (message, bot) => {

	const request = require('request');

	const options = {
	  method: 'POST',
	  url: 'https://qr-code8.p.rapidapi.com/qrcode/generate',
	  headers: {
	    'content-type': 'application/json',
	    'x-rapidapi-key': 'b7023317ebmsh16c26f2debac9e5p1bdb16jsnc55522191187',
	    'x-rapidapi-host': 'qr-code8.p.rapidapi.com',
	    useQueryString: true
	  },
	  body: {
	    logo: '/9j/4AAQSkZJRgABAQAASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCABkAGQDAREAAhEBAxEB/8QAHQAAAQUBAQEBAAAAAAAAAAAABQADBAYHCAkCAf/EADYQAAEDAwMCBAQEBgIDAAAAAAECAwQABREGEiEHMRNBUWEIFCJxFSOBkRYyQlOhsTNyYoLB/8QAGwEBAAEFAQAAAAAAAAAAAAAAAAIBAwQFBgf/xAAuEQACAgEDAgQDCQEAAAAAAAAAAQIDEQQhMQUSE0FRcSJhkRQVMoGhwdHh8FL/2gAMAwEAAhEDEQA/APLRA86EWx5KaFUsDqE5oVJDTO6hQmtRvagJbcMnyoMjvyJ9KFMnwuER5UK5I7kbHlQEZcegEhrBoCfFR9VAw2w3+WKETPEigW7HkihIkst7jQBKOxnFCgWiwsjJ4FCmTqbR/wACWoZ2lIV51Pe4uk3Z7Qei2tyKuRK8MjKVOpCkhrIIO3JVg8gdq0+p6pRppdj3fyNvpelajVx747Izvqr8P186SriuT5EG4wJZIYlwlnnGeFNqAUg8H1HHesrSayrWJury5MTV6K7RyStXJnDtswO1Zxgg2VAxnihXIKfjbT2oSyRtmDQqSY3ChQoG2FANihEzxAoSXA82KEghGb7UIhmDH3EcUBtfw2aEGsuq1lbejJk2+3q/E5iHP5S0zhQSf+y9iceeawddqPs1Eprnhe7MvRUfadRGD48/Y7D6Z6cv8Lqdf79qPUL9303JmKmRLfJKcNrWDkb85IyRgeQSBXnuothbXGKjiS5fqek1KVUp/FlPhensYj1rsUTUt+vclct5M63IV4EVMg+E4lSgf5exIAV/vvXW9E7VVJeZynXnOXY/IwuTbMA8V0ZyOQHOg4zxQkV6bG254oVQIdRtNCQmlYIoAky/hAoRwUdHahMfaHNCoVip7UIlhtrWSKEWd7/Cv0wRobpNJ1bcY5/ENSR1KYKgfyISFfQSO+HFAqJ8khB9a5HrV/dONC8t2dZ0TTvtlc/PYy+5XzUEDqZDkyLi8dOArS+gghHZRScjjO7HOcVqu2Dre251SklJLOxlmsOoTknqa6W3QQiUwEtt8hSAolQPlz9I/WtzoIyripmm6m4TXhhK8W35SU+yQB4a1J47d+K6pPKPP5LDKrc44GeKBFTuLQBNCRXZQwTQmRN2DQrgfQ+QmhTBWE9qFSQz3oVCsQ9qETXugnSyZ1g17BsLG5qCB8xcZYHEaKkjer/schKR5qUPerN10KIOyb2RcqpnfNVwW7PT27MQ5Gh5DTaPlY0VDbEdls48JCU7UBPphIArzOd0r7nZLlnqFNEdPVGuPCOWdbaHj3crZStKGycrPhAKV98EZ/as+uTiWLHnY591/wBOotkmIdiAhwHkgBI/YVt6Lm/hZp7ql+JFvnqi3+wM3Fh0C4Ntfnsf3EJwCse6eNw9CD5Guk081OKOR1dTrm2uDP7oofVWQYaKhc1DJoSKzMVyaEwetzBoD58ag3AyKAfbPNCQTir7UInor8Bel2YPRi5XtDI+autwdS69jnYyAlCM+gJWceqq4jrlsnfGrOyWfqdt0KmKqlbjdvBueo7uIWjX20KSlLjgKlHy47VoaludJZIwa0y16gbekNnxUqcWElPkhJxuJPAGR3/athjBhzjuU7V+iZNyS8rwuOcY5q/CeCzKGdigfw5P06/AlRmwlTD35u/kFtQKVbk+Y559ifStrXqGo5jytzVW6eMm4z4ewF6j6KkafjJukVCnbO6oJKgdxjLPZCz6H+lXYjjuK32m1MdRHK5OV1WlnpZ4lx5MyW4yM55rLMRFelOZJoSBjzhzQDPie9CuCGg0IodQcUJk2M5g4oUPUH4KbsuzfDBbWJcRam5L0yQyWwAshTyglWCRuGQeR5V591lJ6xtPyR6B0RN6Ve7CnxBS5Vn6dtzY8RlTKGDlaFFKz5c+RrX0bs3uFKSRI6X9PBa9BadhMRQ66qI27OnOj6ErV9RCRjKiM49Perk7MyZj2NNuTfsv9x/tgzeLdaylduiINyuKUZMaInese6j2SPckUUnyywoya73tH1fH9/kZVq7S820QXXRBhKm43YkzAG2fY4BKj/ithRJ9yaZgXuuaw28fJblL6ffJTnL9aLiqPd4zEJch5uMSGUMKVhTJB7gE8H7EYIrJ73RqIyg9mWrKvtGlamvrz7nH2qm0W2+XGG0srajyHGkKJySkKIH+MV2aeVk4TGHgrUh7vVQQHF5NCQ3uoCMhXFCD2Y8k0JBfTFkmap1DbLLb0pVOuMluIwFnCd61BKcnyGTk+wqMpKMXJ8InGLk1Fcs9kenWio2idF23TaJz5YtVtbgJnNAeDJDaAN5QchJJB/xXmHULvGvlYuGz0np9Xg0Rg+UZr8TentQ3PpYmBZIrk9S4qXVtMgqO3dzwO+B6U00oqfxGdCajNOQX08+m7aJt38RaxRvLaENWSwIU2sjGNqiRuz9gD71BvEn2ohW8bwhl+st/4X1Ck+Nc7daFQbPHhaOtGAXHpavznD6lPKlH3URU4tN5e5bnKEpd1snOXy4+vH0RiOoLxpCRcfkG5Nz1zdQTuYjA+Hu9NqP/AKaz4uUVl7FJU3tZwoL9f1/ZAe1h2waR1vd59lRYPmW24kZhsAFxHcnj9KurN1sO3dIwb4eDGMe5vl7nLfXe0R7dqGBcoiUoj3aGl9SUDADqfpWR9/pV9ya7xYwsHnbz3NMyl13caqCOpVCp87qFCODg0DWR1KqEU8bM1P4Yo7Ezr7oduQra1+IBefdLa1J/yBWBr21pbGvQ2GhWdTWvmj1ZsLd2jseFbpsZTZSUATEKJTn3Sef2rzCck3uenV9nMk/yM8ut06ldPJMhEptm7W4EhtTCNxCPQo7/AKisiDqn8ilsK5cbFUT16sypjv4iybdNAx8wMsrSfTdgcexrJ8BtbGK6LFulknOSNLa1irm3W5TL3FcUBsVNAaTk8DCcZ/8AbNW34le0UX6rJw+HPa/bc+vxHTmk7U61ZLU800ofnpgoKEhsE5C3zwkHjKU8nPNWu2yx/EzLjZCvM3JZ+e7/ACX7nOHU/qIvXbzOkrLDTFZDuwraISgd92xI5I91Y5HAHNdLoqHWu5+ZoeoahTbk3l/7n+iifETZxadJ6caUoKdivraB/wDFSM/7SK6HSzbTiziNTDD7/UwFSs1sDBGlKoUbwNleDQpg+KEz9SrH2oUayHdGajc0lqyzXtonfb5jUr6e5CVAkftkVatgrYSg/NYJ1WOqyM/RnrboTXEabBjyWnkusOIS4hYOQpJGQf2Iryy2mUJOLPUK7lOKaNBueroN4tP/ABJL7YxuPpVhVtMk5ZKVcIseenCmWXQoc7m0q/3V9ZRYlGJR750B0dfmlOO21hlxX1EtDZz+mKzIXzRFWWV/gkZPrL4ci8h2Oxqa4tWw5PyKni40DkHIB+w7+lZ9VyTz2rJYlqLDP2dBW3piw66h1SlpyovOEA/oBwKz/FlPY11i7nlmGdXteK1QI0XeVNtulwZOfLA/2a3ejg1mTNBrZp4ijMlKrZmpbwNKV5CgS9T5oSFQCoD9BIoDpv4Z/iAFkiNaYvEnZ4X0wHnFYCk/2iT2I/p9Rx5Cud6jou5+NBe/8nQ9O1vavBm/b+Dqm3a/Q8dzb4Ge6Sa5t0nRqwJp181HGVrBP3qHglfEIk3qdHDasPhJ++KuRpwWpWFB1H1ajtBw/MA/rWXCosSmcz9XOrab285HZe8RI7hJ7+1bjTaZyeWarU6mNawuTEJElUh1TizlSq6BJRWEc1KUpvLGCompBLB+UKioBUAqAVAKgLbZuquprI2ltm5OOtJGEpeO7A+/esKzR02POMexnV626tYzlfMOHr5qZSNpcQffJrG+7q/UyfvKf/IKmdXtSS8gyggH0FXFoKkQfULHwgDP1XdrlkSJzqge4BxWRHTVQ4RjS1Vs+WCck+dZRitt7sVCgqAVAKgFQCoBUAqAVAKgFQCoBUAqAVAKgFQH/9k=',
	    text: message.args[1],
	    width: 500
	  },
	  json: true
	};

	request(options, async function (error, response, body) {
		if (error) throw new Error(error);

		let icon = body.b64ImgUrl;
		const iconBuffer = Buffer.from(icon.replace('data:image/png;base64,', ''), 'base64');

		const last = await uvk.upload.photoAlbum({
			album_id: 278410279,
			source: {
				value: iconBuffer
			}
		});

		let ph = `photo539557764_${last[0].id}`;

		//message.send(ph);

		await vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), chat_id: message.chatId, attachment: ph });

		//console.log(body);
	});

});

cmd.hear(/^(?:сократить)\s(.*)$/i, async (message, bot) => {

	const request = require('request');

const options = {
  method: 'POST',
  url: 'https://url-shortener-service.p.rapidapi.com/shorten',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'x-rapidapi-key': 'b7023317ebmsh16c26f2debac9e5p1bdb16jsnc55522191187',
    'x-rapidapi-host': 'url-shortener-service.p.rapidapi.com',
    useQueryString: true
  },
  form: {url: message.args[1]}
};

request(options, function (error, response, body) {
	if (error){
		message.send(`Используйте https:// или http://`);
	}else{
		let res = JSON.parse(body);
	  message.send(res.result_url);
	}
});

});

cmd.hear(/^(?:цвет)$/i, async (message, bot) => {

	let a = message.getAttachments('photo');

	const deepai = require('deepai');

	deepai.setApiKey('7b665286-68cf-4185-8d43-a4c6fb6cbe4b');

  var resp = await deepai.callStandardApi("colorizer", {
          image: a[0].largeSizeUrl,
  });
  console.log(resp);

	let ht = resp.output_url;

	const last = await uvk.upload.photoAlbum({
		album_id: 278410279,
		source: {
			value: ht
		}
	});

	let ph = `photo539557764_${last[0].id}`;

	//message.send(ph);

	await vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), chat_id: message.chatId, attachment: ph });

});

cmd.hear(/^(?:лицо)$/i, async (message, bot) => {

	let a = message.getAttachments('photo');

	const deepai = require('deepai');

	deepai.setApiKey('7b665286-68cf-4185-8d43-a4c6fb6cbe4b');

  var resp = await deepai.callStandardApi("toonify", {
          image: a[0].largeSizeUrl,
  });
  console.log(resp);

	let ht = resp.output_url;

	const last = await uvk.upload.photoAlbum({
		album_id: 278410279,
		source: {
			value: ht
		}
	});

	let ph = `photo539557764_${last[0].id}`;

	//message.send(ph);

	await vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), chat_id: message.chatId, attachment: ph });

});

cmd.hear(/^(?:ft)\s(.*)$/i, async (message, bot) => {

	let res = message.args[1];

	const deepai = require('deepai');

	deepai.setApiKey('7b665286-68cf-4185-8d43-a4c6fb6cbe4b');

  var resp = await deepai.callStandardApi("text2img", {
          text: res,
  });
  console.log(resp);

	let ht = resp.output_url;

	const last = await uvk.upload.photoAlbum({
		album_id: 278410279,
		source: {
			value: ht
		}
	});

	let ph = `photo539557764_${last[0].id}`;

	//message.send(ph);

	await vk.api.messages.send({ random_id: getRandomFloat(1, 10000000), chat_id: message.chatId, attachment: ph });

});

cmd.hear(/^(?:найти)$/i, async (message, bot) => {

	let a = message.getAttachments('photo');

	const deepai = require('deepai');

	deepai.setApiKey('7b665286-68cf-4185-8d43-a4c6fb6cbe4b');

  var resp = await deepai.callStandardApi("densecap", {
          image: a[0].largeSizeUrl,
  });

	console.log(resp.output.captions);

	let text = ``;
	let i = 0;
	while(i < resp.output.captions.length){
		text += `${resp.output.captions[i].caption}, `;
		i++;
	}
  message.send(text);

});

function getRandomFloat(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getBadApples(){
	const res = [];

	let i = 0;
	while(i < 10){
		if(i === 0){
			var res1 = getRandomFloat(1, 6);
			var line = ``;

				if(res1 === 1){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 2){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 3){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 4){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 5){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

			res.push({
				apple1: res1,
				line: line
			});
		}

		if(i === 1){
			var res1 = getRandomFloat(1, 6);
			var line = ``;

				if(res1 === 1){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 2){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 3){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 4){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 5){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

			res.push({
				apple1: res1,
				line: line
			});
		}

		if(i === 2){
			var res1 = getRandomFloat(1, 6);
			var line = ``;

				if(res1 === 1){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 2){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 3){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 4){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 5){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

			res.push({
				apple1: res1,
				line: line
			});
		}

		if(i === 3){
			var res1 = getRandomFloat(1, 6);
			var line = ``;

				if(res1 === 1){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 2){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 3){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 4){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 5){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

			res.push({
				apple1: res1,
				line: line
			});
		}

		if(i === 4){
			var res1 = getRandomFloat(1, 6);
			var res2 = 0;
			var line = ``;

			let d = 0;
			while(d === 0){
				res2 = getRandomFloat(1, 6);
				if(res1 !== res2){
					d = 1;
				}
			};

				if(res1 === 1 || res2 === 1){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 2 || res2 === 2){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 3 || res2 === 3){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 4 || res2 === 4){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 5 || res2 === 5){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

			res.push({
				apple1: res1,
				apple2: res2,
				line: line
			});
		}

		if(i === 5){
			var res1 = getRandomFloat(1, 6);
			var res2 = 0;
			var line = ``;

			let d = 0;
			while(d === 0){
				res2 = getRandomFloat(1, 6);
				if(res1 !== res2){
					d = 1;
				}
			};

				if(res1 === 1 || res2 === 1){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 2 || res2 === 2){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 3 || res2 === 3){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 4 || res2 === 4){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 5 || res2 === 5){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

			res.push({
				apple1: res1,
				apple2: res2,
				line: line
			});
		}

		if(i === 6){
			var res1 = getRandomFloat(1, 6);
			var res2 = 0;
			var line = ``;

			let d = 0;
			while(d === 0){
				res2 = getRandomFloat(1, 6);
				if(res1 !== res2){
					d = 1;
				}
			};

				if(res1 === 1 || res2 === 1){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 2 || res2 === 2){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 3 || res2 === 3){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 4 || res2 === 4){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

				if(res1 === 5 || res2 === 5){
					line += `🐛`;
				}else{
					line += `🍎`;
				}

			res.push({
				apple1: res1,
				apple2: res2,
				line: line
			});
		}

		if(i === 7){
			var res1 = getRandomFloat(1, 6);
			var res2 = 0;
			var line = ``;

			let d = 0;
			while(d === 0){
				res2 = getRandomFloat(1, 6);
				if(res1 !== res2){
					d = 1;
				}
			};

				if(res1 === 1 || res2 === 1){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 2 || res2 === 2){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 3 || res2 === 3){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 4 || res2 === 4){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 5 || res2 === 5){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

			res.push({
				apple1: res1,
				apple2: res2,
				line: line
			});
		}

		if(i === 8){
			var res1 = getRandomFloat(1, 6);
			var res2 = 0;
			var line = ``;

			let d = 0;
			while(d === 0){
				res2 = getRandomFloat(1, 6);
				if(res1 !== res2){
					d = 1;
				}
			};

				if(res1 === 1 || res2 === 1){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 2 || res2 === 2){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 3 || res2 === 3){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 4 || res2 === 4){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 5 || res2 === 5){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

			res.push({
				apple1: res1,
				apple2: res2,
				line: line
			});
		}

		if(i === 9){
			var res1 = getRandomFloat(1, 6);
			var line = ``;

				if(res1 === 1){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 2){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 3){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 4){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

				if(res1 === 5){
					line += `🍎`;
				}else{
					line += `🐛`;
				}

			res.push({
				apple1: res1,
				line: line
			});
		}

		i++;
	}

	return res;

}

cmd.hear(/^(.*)$/i, async (message, bot) => {

	console.log(message.args[1]);


	let group = `[club204786036|@bebra_bot]`;

	let randt = getRandomFloat(1, 101);
	console.log(randt);
	if(randt === 5){
		const deepai = require('deepai');

		deepai.setApiKey('7b665286-68cf-4185-8d43-a4c6fb6cbe4b');

    var resp = await deepai.callStandardApi("text-generator", {
            text: message.args[0],
    });
    message.send(resp.output);
	}

// GAME "APPLE OF FORTUNE"
	if (message.args[0] === `${group} Apple of Fortune` || message.args[0] === `Apple of Fortune`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

		if(added_dialog.games.length > 0){

			var run_games = added_dialog.games.find(x=> x.game_id === 1);

		}else{
			added_dialog.games.push({
				user_id: message.senderId,
				price: 0,
				win: 0,
				step: 0,
				game_id: 1,
				rs1: '',
				rs2: '',
				rs3: '',
				rs4: '',
				rs5: '',
				rs6: '',
				rs7: '',
				rs8: '',
				rs9: '',
				rs10: ''
			});
			saveDialogs();

			var run_games = added_dialog.games.find(x=> x.game_id === 1);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return bot(`извините, игра в данной беседе уже идёт.`);
			}else{

				bot(`Добро пожаловать в игру "Apple Of Fortune"!`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "Начать"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "Завершить"
						},
							"color": "negative"
						}]
					],
						"inline": true
					})
						}

				);

			};
		}

		}else{
			dialogs.push({
				id: message.chatId,
				games: [],
				res: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
// GAME "APPLE OF FORTUNE"


//СТАВКА
	if (message.user.int2 === 1){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		if(!Number(message.args[0])){
			return bot(`Введите сумму ставки:`);
		}
		var price = Number(message.args[0]);
		if(price < 1){
			return bot(`Введите сумму ставки:`);
		}
		price = Number(Math.floor(price).toFixed(2));
		if(message.user.balance < price) return bot(`Недостаточно средств!\nБаланс: ${message.user.balance}`);


		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		run_games.price = price;

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{
				message.user.int2 = 0;

				bot(`Ставка - ${run_games.price}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "Продолжить"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "Завершить"
						},
							"color": "negative"
						}]
					],
						"inline": true
					})
						});

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//СТАВКА


//НАЧАТЬ
	if (message.args[0] === `${group} Начать` || message.args[0] === `Начать`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{

				message.user.int2 = 1;
				message.send(`Введите сумму ставки:`);

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//НАЧАТЬ


//ЗАВЕРШИТЬ
	if (message.args[0] === `${group} Завершить` || message.args[0] === `Завершить`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{

				message.user.int2 = 0;

				message.user.balance -= run_games.price;
				message.user.balance += run_games.win;
				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы завершили игру "Apple Of Fortune"!\n Баланс - ${message.user.balance}`,

				{
				keyboard:JSON.stringify(
				{
				"one_time": false,
				"buttons": [
				[{
				  "action": {
				  "type": "text",
				  "payload": "{\"button\": \"1\"}",
				  "label": "Apple of Fortune"
				},
				"color": "positive"
				}]
				],
				"inline": true
				})
				}

);

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//ЗАВЕРШИТЬ


//ПРОДОЛЖИТЬ
	if (message.args[0] === `${group} Продолжить` || message.args[0] === `Продолжить`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{
				run_games.res = getBadApples();
				saveDialogs();

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}🍎🍎🍎🍎🍎\n${step1.toFixed(2)}🍎🍎🍎🍎🍎\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//ПРОДОЛЖИТЬ


//1 ЯБЛОКО
	if (message.args[0] === `${group} 1🍎` || message.args[0] === `1🍎`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{

				if(run_games.step === 9){

					if(run_games.res[9].apple1 === 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 112.113).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[0].apple1 === 2){
					rs += `🍎 `;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[0].apple1 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[0].apple1 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[0].apple1 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs10 = rs;
				run_games.step += 1;
				message.user.balance -= run_games.price;
				message.user.balance += run_games.win;
				saveDialogs();
				message.send(`${step10.toFixed(2)}${rs}\n${step9.toFixed(2)}${run_games.rs9}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`);

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Поздравляем! Вы полностью прошли игру!\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 8){

					if(run_games.res[8].apple1 === 1 || run_games.res[8].apple2 === 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 54.58).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[8].apple1 === 2 || run_games.res[8].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[8].apple1 === 3 || run_games.res[8].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[8].apple1 === 4 || run_games.res[8].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[8].apple1 === 5 || run_games.res[8].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs9 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}${rs}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "Apple of Fortune"
							},
								"color": "positive"
							}]
					],
						"inline": true
					})
						}

				);

			}
			};

				if(run_games.step === 7){

					if(run_games.res[7].apple1 === 1 || run_games.res[7].apple2 === 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 10.13).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[7].apple1 === 2 || run_games.res[7].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[7].apple1 === 3 || run_games.res[7].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[7].apple1 === 4 || run_games.res[7].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[7].apple1 === 5 || run_games.res[7].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs8 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}${rs}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 6){

					if(run_games.res[6].apple1 !== 1 && run_games.res[6].apple2 !== 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 5.58).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[6].apple1 === 2 || run_games.res[6].apple2 === 2){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[6].apple1 === 3 || run_games.res[6].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[6].apple1 === 4 || run_games.res[6].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[6].apple1 === 5 || run_games.res[6].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs7 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}${rs}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 5){

					if(run_games.res[5].apple1 !== 1 && run_games.res[5].apple2 !== 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 3.37).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[5].apple1 === 2 || run_games.res[5].apple2 === 2){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[5].apple1 === 3 || run_games.res[5].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[5].apple1 === 4 || run_games.res[5].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[5].apple1 === 5 || run_games.res[5].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs6 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}${rs}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 4){

					if(run_games.res[4].apple1 !== 1 && run_games.res[4].apple2 !== 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 2.21).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[4].apple1 === 2 || run_games.res[4].apple2 === 2){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[4].apple1 === 3 || run_games.res[4].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[4].apple1 === 4 || run_games.res[4].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[4].apple1 === 5 || run_games.res[4].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs5 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}${rs}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 3){

					if(run_games.res[3].apple1 !== 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.59).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[3].apple1 === 2){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[3].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[3].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[3].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs4 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}${rs}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 2){

					if(run_games.res[2].apple1 !== 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.32).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[2].apple1 === 2){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[2].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[2].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[2].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs3 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}${rs}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 1){

					if(run_games.res[1].apple1 !== 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.25).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[1].apple1 === 2){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[1].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[1].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[1].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs2 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}${rs}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 0){

					if(run_games.res[0].apple1 !== 1){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.14).toFixed(2));

				let rs = ``;

				rs += `🍏`;
				if(run_games.res[0].apple1 === 2){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[0].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[0].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[0].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs1 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}🍎🍎🍎🍎🍎\n${step1.toFixed(2)}${rs}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//1 ЯБЛОКО


//2 ЯБЛОКО
	if (message.args[0] === `${group} 2🍎` || message.args[0] === `2🍎`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{

				if(run_games.step === 9){

					if(run_games.res[9].apple1 === 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 112.113).toFixed(2));

				let rs = ``;


				if(run_games.res[0].apple1 === 1){
					rs += `🍎 `;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[0].apple1 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[0].apple1 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[0].apple1 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs10 = rs;
				run_games.step += 1;
				message.user.balance -= run_games.price;
				message.user.balance += run_games.win;
				saveDialogs();
				message.send(`${step10.toFixed(2)}${rs}\n${step9.toFixed(2)}${run_games.rs9}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`);

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Поздравляем! Вы полностью прошли игру!\n Баланс - ${message.user.balance}`,

{
keyboard:JSON.stringify(
{
"one_time": false,
"buttons": [
[{
  "action": {
  "type": "text",
  "payload": "{\"button\": \"1\"}",
  "label": "Apple of Fortune"
},
"color": "positive"
}]
],
"inline": true
})
}

);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 8){

					if(run_games.res[8].apple1 === 2 || run_games.res[8].apple2 === 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 54.58).toFixed(2));

				let rs = ``;

				if(run_games.res[8].apple1 === 1 || run_games.res[8].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[8].apple1 === 3 || run_games.res[8].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[8].apple1 === 4 || run_games.res[8].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[8].apple1 === 5 || run_games.res[8].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs9 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}${rs}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 7){

					if(run_games.res[7].apple1 === 2 || run_games.res[7].apple2 === 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 10.13).toFixed(2));

				let rs = ``;

				if(run_games.res[7].apple1 === 1 || run_games.res[7].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[7].apple1 === 3 || run_games.res[7].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[7].apple1 === 4 || run_games.res[7].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[7].apple1 === 5 || run_games.res[7].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs8 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}${rs}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 6){

					if(run_games.res[6].apple1 !== 2 && run_games.res[6].apple2 !== 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 5.58).toFixed(2));

				let rs = ``;

				if(run_games.res[6].apple1 === 1 || run_games.res[6].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[6].apple1 === 3 || run_games.res[6].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[6].apple1 === 4 || run_games.res[6].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[6].apple1 === 5 || run_games.res[6].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs7 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}${rs}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 5){

					if(run_games.res[5].apple1 !== 2 && run_games.res[5].apple2 !== 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 3.37).toFixed(2));

				let rs = ``;

				if(run_games.res[5].apple1 === 1 || run_games.res[5].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[5].apple1 === 3 || run_games.res[5].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[5].apple1 === 4 || run_games.res[5].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[5].apple1 === 5 || run_games.res[5].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs6 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}${rs}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 4){

					if(run_games.res[4].apple1 !== 2 && run_games.res[4].apple2 !== 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 2.21).toFixed(2));

				let rs = ``;

				if(run_games.res[4].apple1 === 1 || run_games.res[4].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[4].apple1 === 3 || run_games.res[4].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[4].apple1 === 4 || run_games.res[4].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[4].apple1 === 5 || run_games.res[4].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs5 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}${rs}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 3){

					if(run_games.res[3].apple1 !== 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.59).toFixed(2));

				let rs = ``;

				if(run_games.res[3].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[3].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[3].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[3].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs4 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}${rs}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 2){

					if(run_games.res[2].apple1 !== 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.32).toFixed(2));

				let rs = ``;

				if(run_games.res[2].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[2].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[2].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[2].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs3 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}${rs}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 1){

					if(run_games.res[1].apple1 !== 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.25).toFixed(2));

				let rs = ``;

				if(run_games.res[1].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[1].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[1].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[1].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs2 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}${rs}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 0){

					if(run_games.res[0].apple1 !== 2){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.14).toFixed(2));

				let rs = ``;

				if(run_games.res[0].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[0].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[0].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[0].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs1 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}🍎🍎🍎🍎🍎\n${step1.toFixed(2)}${rs}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//2 ЯБЛОКО


//3 ЯБЛОКО
	if (message.args[0] === `${group} 3🍎` || message.args[0] === `3🍎`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{

				if(run_games.step === 9){

					if(run_games.res[9].apple1 === 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 112.113).toFixed(2));

				let rs = ``;


				if(run_games.res[0].apple1 === 1){
					rs += `🍎 `;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[0].apple1 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[0].apple1 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[0].apple1 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs10 = rs;
				run_games.step += 1;
				message.user.balance -= run_games.price;
				message.user.balance += run_games.win;
				saveDialogs();
				message.send(`${step10.toFixed(2)}${rs}\n${step9.toFixed(2)}${run_games.rs9}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`);

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Поздравляем! Вы полностью прошли игру!\n Баланс - ${message.user.balance}`,

{
keyboard:JSON.stringify(
{
"one_time": false,
"buttons": [
[{
  "action": {
  "type": "text",
  "payload": "{\"button\": \"1\"}",
  "label": "Apple of Fortune"
},
"color": "positive"
}]
],
"inline": true
})
}

);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 8){

					if(run_games.res[8].apple1 === 3 || run_games.res[8].apple2 === 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 54.58).toFixed(2));

				let rs = ``;

				if(run_games.res[8].apple1 === 1 || run_games.res[8].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[8].apple1 === 2 || run_games.res[8].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[8].apple1 === 4 || run_games.res[8].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[8].apple1 === 5 || run_games.res[8].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs9 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}${rs}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 7){

					if(run_games.res[7].apple1 === 3 || run_games.res[7].apple2 === 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 10.13).toFixed(2));

				let rs = ``;

				if(run_games.res[7].apple1 === 1 || run_games.res[7].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[7].apple1 === 2 || run_games.res[7].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[7].apple1 === 4 || run_games.res[7].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				if(run_games.res[7].apple1 === 5 || run_games.res[7].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs8 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}${rs}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 6){

					if(run_games.res[6].apple1 !== 3 && run_games.res[6].apple2 !== 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 5.58).toFixed(2));

				let rs = ``;

				if(run_games.res[6].apple1 === 1 || run_games.res[6].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[6].apple1 === 2 || run_games.res[6].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[6].apple1 === 4 || run_games.res[6].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[6].apple1 === 5 || run_games.res[6].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs7 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}${rs}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 5){

					if(run_games.res[5].apple1 !== 3 && run_games.res[5].apple2 !== 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 3.37).toFixed(2));

				let rs = ``;

				if(run_games.res[5].apple1 === 1 || run_games.res[5].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[5].apple1 === 2 || run_games.res[5].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[5].apple1 === 4 || run_games.res[5].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[5].apple1 === 5 || run_games.res[5].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs6 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}${rs}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 4){

					if(run_games.res[4].apple1 !== 3 && run_games.res[4].apple2 !== 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 2.21).toFixed(2));

				let rs = ``;

				if(run_games.res[4].apple1 === 1 || run_games.res[4].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[4].apple1 === 2 || run_games.res[4].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[4].apple1 === 4 || run_games.res[4].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[4].apple1 === 5 || run_games.res[4].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs5 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}${rs}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 3){

					if(run_games.res[3].apple1 !== 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.59).toFixed(2));

				let rs = ``;

				if(run_games.res[3].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[3].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[3].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[3].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs4 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}${rs}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 2){

					if(run_games.res[2].apple1 !== 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.32).toFixed(2));

				let rs = ``;

				if(run_games.res[2].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[2].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[2].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[2].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs3 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}${rs}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 1){

					if(run_games.res[1].apple1 !== 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.25).toFixed(2));

				let rs = ``;

				if(run_games.res[1].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[1].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[1].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[1].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs2 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}${rs}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 0){

					if(run_games.res[0].apple1 !== 3){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.14).toFixed(2));

				let rs = ``;

				if(run_games.res[0].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[0].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[0].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				if(run_games.res[0].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs1 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}🍎🍎🍎🍎🍎\n${step1.toFixed(2)}${rs}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//3 ЯБЛОКО


//4 ЯБЛОКО
	if (message.args[0] === `${group} 4🍎` || message.args[0] === `4🍎`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{

				if(run_games.step === 9){

					if(run_games.res[9].apple1 === 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 112.113).toFixed(2));

				let rs = ``;


				if(run_games.res[0].apple1 === 1){
					rs += `🍎 `;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[0].apple1 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[0].apple1 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[0].apple1 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs10 = rs;
				run_games.step += 1;
				message.user.balance -= run_games.price;
				message.user.balance += run_games.win;
				saveDialogs();
				message.send(`${step10.toFixed(2)}${rs}\n${step9.toFixed(2)}${run_games.rs9}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`);

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Поздравляем! Вы полностью прошли игру!\n Баланс - ${message.user.balance}`,

{
keyboard:JSON.stringify(
{
"one_time": false,
"buttons": [
[{
  "action": {
  "type": "text",
  "payload": "{\"button\": \"1\"}",
  "label": "Apple of Fortune"
},
"color": "positive"
}]
],
"inline": true
})
}

);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 8){

					if(run_games.res[8].apple1 === 4 || run_games.res[8].apple2 === 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 54.58).toFixed(2));

				let rs = ``;

				if(run_games.res[8].apple1 === 1 || run_games.res[8].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[8].apple1 === 2 || run_games.res[8].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[8].apple1 === 3 || run_games.res[8].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[8].apple1 === 5 || run_games.res[8].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs9 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}${rs}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 7){

					if(run_games.res[7].apple1 === 4 || run_games.res[7].apple2 === 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 10.13).toFixed(2));

				let rs = ``;

				if(run_games.res[7].apple1 === 1 || run_games.res[7].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[7].apple1 === 2 || run_games.res[7].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[7].apple1 === 3 || run_games.res[7].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;
				if(run_games.res[7].apple1 === 5 || run_games.res[7].apple2 === 5){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				run_games.rs8 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}${rs}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 6){

					if(run_games.res[6].apple1 !== 4 && run_games.res[6].apple2 !== 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 5.58).toFixed(2));

				let rs = ``;

				if(run_games.res[6].apple1 === 1 || run_games.res[6].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[6].apple1 === 2 || run_games.res[6].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[6].apple1 === 3 || run_games.res[6].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[6].apple1 === 5 || run_games.res[6].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs7 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}${rs}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 5){

					if(run_games.res[5].apple1 !== 4 && run_games.res[5].apple2 !== 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 3.37).toFixed(2));

				let rs = ``;

				if(run_games.res[5].apple1 === 1 || run_games.res[5].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[5].apple1 === 2 || run_games.res[5].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[5].apple1 === 3 || run_games.res[5].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[5].apple1 === 5 || run_games.res[5].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs6 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}${rs}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 4){

					if(run_games.res[4].apple1 !== 4 && run_games.res[4].apple2 !== 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 2.21).toFixed(2));

				let rs = ``;

				if(run_games.res[4].apple1 === 1 || run_games.res[4].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[4].apple1 === 2 || run_games.res[4].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[4].apple1 === 3 || run_games.res[4].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[4].apple1 === 5 || run_games.res[4].apple2 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs5 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}${rs}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 3){

					if(run_games.res[3].apple1 !== 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.59).toFixed(2));

				let rs = ``;

				if(run_games.res[3].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[3].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[3].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[3].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs4 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}${rs}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 2){

					if(run_games.res[2].apple1 !== 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.32).toFixed(2));

				let rs = ``;

				if(run_games.res[2].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[2].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[2].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[2].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs3 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}${rs}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 1){

					if(run_games.res[1].apple1 !== 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.25).toFixed(2));

				let rs = ``;

				if(run_games.res[1].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[1].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[1].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[1].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs2 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}${rs}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 0){

					if(run_games.res[0].apple1 !== 4){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.14).toFixed(2));

				let rs = ``;

				if(run_games.res[0].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[0].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[0].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;
				if(run_games.res[0].apple1 === 5){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				run_games.rs1 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}🍎🍎🍎🍎🍎\n${step1.toFixed(2)}${rs}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//4 ЯБЛОКО


//5 ЯБЛОКО
	if (message.args[0] === `${group} 5🍎` || message.args[0] === `5🍎`){

		if(message.isChat){
			return bot(`Бот работает только в ЛС!`);
		}

		var added_dialog = dialogs.find(x=> x.id === message.chatId);
		var run_games = added_dialog.games.find(x=> x.game_id === 1);

		if(added_dialog){
			console.log(`Беседа есть в БД`);

			if(run_games.open === false && run_games.user_id !== message.senderId){
				return;
			}else{

				if(run_games.step === 9){

					if(run_games.res[9].apple1 === 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 112.113).toFixed(2));

				let rs = ``;


				if(run_games.res[0].apple1 === 1){
					rs += `🍎 `;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[0].apple1 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[0].apple1 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[0].apple1 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;

				run_games.rs10 = rs;
				run_games.step += 1;
				message.user.balance -= run_games.price;
				message.user.balance += run_games.win;
				saveDialogs();
				message.send(`${step10.toFixed(2)}${rs}\n${step9.toFixed(2)}${run_games.rs9}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`);

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Поздравляем! Вы полностью прошли игру!\n Баланс - ${message.user.balance}`,

{
keyboard:JSON.stringify(
{
"one_time": false,
"buttons": [
[{
  "action": {
  "type": "text",
  "payload": "{\"button\": \"1\"}",
  "label": "Apple of Fortune"
},
"color": "positive"
}]
],
"inline": true
})
}

);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 8){

					if(run_games.res[8].apple1 === 5 || run_games.res[8].apple2 === 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 54.58).toFixed(2));

				let rs = ``;

				if(run_games.res[8].apple1 === 1 || run_games.res[8].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[8].apple1 === 2 || run_games.res[8].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[8].apple1 === 3 || run_games.res[8].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[8].apple1 === 4 || run_games.res[8].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;

				run_games.rs9 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}${rs}\n${step8.toFixed(2)}${run_games.rs8}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 7){

					if(run_games.res[7].apple1 === 5 || run_games.res[7].apple2 === 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 10.13).toFixed(2));

				let rs = ``;

				if(run_games.res[7].apple1 === 1 || run_games.res[7].apple2 === 1){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[7].apple1 === 2 || run_games.res[7].apple2 === 2){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[7].apple1 === 3 || run_games.res[7].apple2 === 3){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}

				if(run_games.res[7].apple1 === 4 || run_games.res[7].apple2 === 4){
					rs += `🍎`;
				}else{
					rs += `🐛`;
				}
				rs += `🍏`;

				run_games.rs8 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}${rs}\n${step7.toFixed(2)}${run_games.rs7}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 6){

					if(run_games.res[6].apple1 !== 5 && run_games.res[6].apple2 !== 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 5.58).toFixed(2));

				let rs = ``;

				if(run_games.res[6].apple1 === 1 || run_games.res[6].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[6].apple1 === 2 || run_games.res[6].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[6].apple1 === 3 || run_games.res[6].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[6].apple1 === 4 || run_games.res[6].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;

				run_games.rs7 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}${rs}\n${step6.toFixed(2)}${run_games.rs6}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 5){

					if(run_games.res[5].apple1 !== 5 && run_games.res[5].apple2 !== 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 3.37).toFixed(2));

				let rs = ``;

				if(run_games.res[5].apple1 === 1 || run_games.res[5].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[5].apple1 === 2 || run_games.res[5].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[5].apple1 === 3 || run_games.res[5].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[5].apple1 === 4 || run_games.res[5].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;

				run_games.rs6 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}${rs}\n${step5.toFixed(2)}${run_games.rs5}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 4){

					if(run_games.res[4].apple1 !== 5 && run_games.res[4].apple2 !== 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 2.21).toFixed(2));

				let rs = ``;

				if(run_games.res[4].apple1 === 1 || run_games.res[4].apple2 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[4].apple1 === 2 || run_games.res[4].apple2 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[4].apple1 === 3 || run_games.res[4].apple2 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[4].apple1 === 4 || run_games.res[4].apple2 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;

				run_games.rs5 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}${rs}\n${step4.toFixed(2)}${run_games.rs4}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 3){

					if(run_games.res[3].apple1 !== 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.59).toFixed(2));

				let rs = ``;

				if(run_games.res[3].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[3].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[3].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[3].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;

				run_games.rs4 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}${rs}\n${step3.toFixed(2)}${run_games.rs3}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 2){

					if(run_games.res[2].apple1 !== 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.32).toFixed(2));

				let rs = ``;

				if(run_games.res[2].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[2].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[2].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[2].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;

				run_games.rs3 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}${rs}\n${step2.toFixed(2)}${run_games.rs2}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 1){

					if(run_games.res[1].apple1 !== 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.25).toFixed(2));

				let rs = ``;

				if(run_games.res[1].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[1].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[1].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[1].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;

				run_games.rs2 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}${rs}\n${step1.toFixed(2)}${run_games.rs1}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

				if(run_games.step === 0){

					if(run_games.res[0].apple1 !== 5){

				var step10 = run_games.price * 112.113;
				var step9 = run_games.price * 54.58;
				var step8 = run_games.price * 10.13;
				var step7 = run_games.price * 5.58;
				var step6 = run_games.price * 3.37;
				var step5 = run_games.price * 2.21;
				var step4 = run_games.price * 1.59;
				var step3 = run_games.price * 1.32;
				var step2 = run_games.price * 1.25;
				var step1 = run_games.price * 1.14;

				run_games.win = Number(Math.floor(run_games.price * 1.14).toFixed(2));

				let rs = ``;

				if(run_games.res[0].apple1 === 1){
					rs += `🐛 `;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[0].apple1 === 2){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[0].apple1 === 3){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}

				if(run_games.res[0].apple1 === 4){
					rs += `🐛`;
				}else{
					rs += `🍎`;
				}
				rs += `🍏`;

				run_games.rs1 = rs;
				run_games.step += 1;
				saveDialogs();
				message.send(`${step10.toFixed(2)}🍎🍎🍎🍎🍎\n${step9.toFixed(2)}🍎🍎🍎🍎🍎\n${step8.toFixed(2)}🍎🍎🍎🍎🍎\n${step7.toFixed(2)}🍎🍎🍎🍎🍎\n${step6.toFixed(2)}🍎🍎🍎🍎🍎\n${step5.toFixed(2)}🍎🍎🍎🍎🍎\n${step4.toFixed(2)}🍎🍎🍎🍎🍎\n${step3.toFixed(2)}🍎🍎🍎🍎🍎\n${step2.toFixed(2)}🍎🍎🍎🍎🍎\n${step1.toFixed(2)}${rs}\n\nТекущий выигрыш - ${run_games.win}`,

					{
							keyboard:JSON.stringify(
						{
							"one_time": false,
							"buttons": [
								[{
									"action": {
									"type": "text",
									"payload": "{\"button\": \"1\"}",
									"label": "1🍎"
							},
								"color": "positive"
							}],
							[{
								"action": {
								"type": "text",
								"payload": "{\"button\": \"2\"}",
								"label": "2🍎"
						},
							"color": "positive"
						}],
						[{
							"action": {
							"type": "text",
							"payload": "{\"button\": \"3\"}",
							"label": "3🍎"
					},
						"color": "positive"
					}],
					[{
						"action": {
						"type": "text",
						"payload": "{\"button\": \"4\"}",
						"label": "4🍎"
				},
					"color": "positive"
				}],
				[{
					"action": {
					"type": "text",
					"payload": "{\"button\": \"5\"}",
					"label": "5🍎"
			},
				"color": "positive"
			}],
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"6\"}",
				"label": "Завершить"
		},
			"color": "negative"
		}]
					],
						"inline": true
					})
						}

				);

			}else{

				let text = ``;

				let i = 9;
				while(i !== (-1)){
					text += `${run_games.res[i].line}\n`;
					i--;
				}

				message.send(text);

				message.user.balance -= run_games.price;

				var deletedItem = added_dialog.games.splice(0,1);
				saveDialogs();

				bot(`Вы проиграли! Начать новую игру?\n Баланс - ${message.user.balance}`,

  {
      keyboard:JSON.stringify(
    {
      "one_time": false,
      "buttons": [
        [{
          "action": {
          "type": "text",
          "payload": "{\"button\": \"1\"}",
          "label": "Apple of Fortune"
      },
        "color": "positive"
      }]
  ],
    "inline": true
  })
    }

);

			}
			};

			};

		}else{
			dialogs.push({
				id: message.chatId,
				games: []
			});
			saveDialogs();

			console.log(`Беседа успешно добавлена в БД`);
		};

	};
//5 ЯБЛОКО

});
