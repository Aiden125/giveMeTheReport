const { Configuration, OpenAIApi } = require("openai");
const apiKey = '';
const serverless = require('serverless-http');
const express = require('express')
const cors = require('cors');
const app = express();

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

// CORS 이슈 해결
let corsOptions = {
    origin: 'https://chatdog-1bk.pages.dev/', //여기서 날라오는게 아니면 다 막아주게
    credentials: true
}
app.use(cors(corsOptions));


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/moon', async function (req, res) {
        let { myDateTime, userMessages, assistantMessages} = req.body;

        let todayDateTime = new Date().toLocaleDateString()('ko-KR', { timeZone: 'Asia/Seoul' });

        let messages = [
            {role: "system", content: "당신은 세계 최고의 운세예측가입니다. 이름은 운측가이며, 운세와 관련된 무수한 지식이 있어서 운세에 관련해서 무엇이든 답변해줄 수 있습니다."}, // 넣어줄 가스라이팅
            {role: "user", content: "당신은 세계 최고의 운세예측가입니다. 이름은 운측가이며, 운세와 관련된 무수한 지식이 있어서 운세에 관련해서 무엇이든 답변해줄 수 있습니다."},// 넣어줄 가스라이팅
            {role: "assistant", content: '안녕하세요, 저는 운측가입니다. 운세와 관련된 모든 질문에 대해 답변해드릴 수 있습니다. 무엇을 도와드릴까요?'},
            {role: "user", content: `저의 생년월일은${myDateTime}입니다. 그리고 오늘은 ${todayDateTime}입니다`},
            {role: "assistant", content: `당신의 생년월일은 ${myDateTime}인 것을 확인했습니다. 그리고 오늘은 ${todayDateTime}인 것도 확인하였습니다. 운세에 대해 어떤 것이든 물어보세요 `},
        ]

        while (userMessages.length != 0 || assistantMessages.length != 0) {
            if (userMessages.length != 0) {
                messages.push(
                    JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g, "")+'"}') // shift는 앞에꺼부터 pop하는 개념
                )
            }
            if (assistantMessages.length != 0) {
                messages.push(
                    JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g, "")+'"}')
                )
            }
        }

        console.log(messages);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 100,
            temperature: 0.5,
            messages: messages
        });
        let fortune = completion.data.choices[0].message['content'];
        res.send({"assistant" : fortune});
});

module.exports.handler = serverless(app);
// app.listen(3000)

