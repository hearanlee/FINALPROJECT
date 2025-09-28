const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI 클라이언트 설정
const openai = new OpenAI({
    apiKey: process.env.GITHUB_PAT,
    baseURL: process.env.AZURE_AI_ENDPOINT || "https://models.github.ai/inference",
});

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// FastAPI 백엔드로 프록시 설정
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    onError: (err, req, res) => {
        console.log('프록시 오류:', err.message);
        // FastAPI가 실행되지 않을 때 대체 응답
        res.status(503).json({ 
            error: '백엔드 서버에 연결할 수 없습니다.',
            details: 'FastAPI 서버가 실행 중인지 확인해주세요.'
        });
    }
}));

// GPT API 엔드포인트 (백업용)
app.post('/api/chat-backup', async (req, res) => {
    try {
        const { message, model = 'gpt-3.5-turbo' } = req.body;

        if (!message) {
            return res.status(400).json({ error: '메시지가 필요합니다.' });
        }

        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "당신은 포핸즈 음식점의 친근한 직원입니다. 고객의 질문에 대해 도움을 드리고, 메뉴를 추천해드립니다. 음성 대화를 위해 간결하고 명확하게 답변해주세요. 메뉴 카테고리: 쌀국수, 돈카츠,카레, 1인정식"
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const gptResponse = response.choices[0].message.content;
        
        res.json({
            response: gptResponse,
            model: model
        });

    } catch (error) {
        console.error('GPT API 오류:', error);
        res.status(500).json({ 
            error: 'GPT API 호출 중 오류가 발생했습니다.',
            details: error.message 
        });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
    console.log(`🎤 음성 대화를 시작하려면 브라우저에서 접속하세요!`);
});
