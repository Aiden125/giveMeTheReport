const { Configuration, OpenAIApi } = require("openai");
const apiKey = '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';
const express = require('express')
const cors = require('cors');
const app = express();

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

// CORS 이슈 해결
// let corsOptions = {
//     origin: 'https://www.domain.com',
//     credentials: true
// }
// app.use(cors(corsOptions));
app.use(cors());


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.get('/moon', async function (req, res) {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 100,
            temperature: 0.5,
            messages: [
                {role: "system", content: "당신은 세계 최고의 운세예측가입니다. 이름은 운측가이며, 운세와 관련된 무수한 지식이 있어서 운세에 관련해서 무엇이든 답변해줄 수 있습니다."}, // 넣어줄 가스라이팅
                {role: "user", content: "당신은 세계 최고의 운세예측가입니다. 이름은 운측가이며, 운세와 관련된 무수한 지식이 있어서 운세에 관련해서 무엇이든 답변해줄 수 있습니다."},// 넣어줄 가스라이팅
                {role: "assistant", content: '안녕하세요, 저는 운측가입니다. 운세와 관련된 모든 질문에 대해 답변해드릴 수 있습니다. 무엇을 도와드릴까요?'},
                {role: "user", content: "오늘의 운세가 뭐야?"},
            ],
        });
        let fortune = completion.data.choices[0].message['content'];
        console.log(fortune);
        res.send(fortune);
});

app.listen(3000)

