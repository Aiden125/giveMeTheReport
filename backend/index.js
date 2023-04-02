const apiKey = "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"
const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
let corsOptions = {
    origin: 'https://chatdog-1bk.pages.dev',
    credentials: true
}
app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/moon', async function (req, res) {
    let { myDateTime, userMessages, assistantMessages} = req.body

    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    let messages = [
        {role: "system", content: "내가 레포트 주제에 대해서 물어볼건데 자연스럽고 안끊기게 500글자 내외로 알려줘"},
        {role: "user", content: "내가 레포트에 주제에 대해서 물어볼건데 자연스럽고 안끊기게 500글자 내외로 알려줘"},
        {role: "assistant", content: "안녕하세요! 필요한 레포트 주제를 입력해주세요."},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    // 3회 retry
    const maxRetries = 3;
    let retries = 0;
    let completion
    while (retries < maxRetries) {
      try {
        completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages
        });
        break;
      } catch (error) {
          retries++;
          console.log(error);
          console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
      }
    }

    let fortune = completion.data.choices[0].message['content']

    res.json({"assistant": fortune});
});

module.exports.handler = serverless(app);

// app.listen(3000)