const messageTests = [
    {
        name: "系统消息测试",
        tests: [
            {
                name: "基本系统消息 - 字符串内容",
                test: async (modelId) => {
                    const messages = [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: "Hello" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "系统消息 - 带名称",
                test: async (modelId) => {
                    const messages = [
                        { role: "system", content: "You are a helpful assistant.", name: "AI_Assistant" },
                        { role: "user", content: "Hello" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "系统消息 - 内容为数组（单个文本）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "system", 
                            content: [
                                { type: "text", text: "You are a helpful assistant." }
                            ]
                        },
                        { role: "user", content: "Hello" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "系统消息 - 内容为数组（多个文本）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "system", 
                            content: [
                                { type: "text", text: "You are a helpful assistant." },
                                { type: "text", text: "Always provide accurate information." }
                            ]
                        },
                        { role: "user", content: "Hello" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "系统消息 - 空内容",
                test: async (modelId) => {
                    const messages = [
                        { role: "system", content: "" },
                        { role: "user", content: "Hello" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "系统消息 - 长文本内容",
                test: async (modelId) => {
                    const longContent = "You are an AI assistant specialized in providing detailed explanations about various topics. Your responses should be comprehensive, accurate, and tailored to the user's level of understanding. Always strive to give examples and analogies when appropriate to make complex concepts more accessible. If you're unsure about something, admit it and suggest where the user might find more information. Your goal is to educate and inform, not just to answer questions.";
                    const messages = [
                        { role: "system", content: longContent },
                        { role: "user", content: "Explain quantum computing" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "系统消息 - 特殊字符",
                test: async (modelId) => {
                    const messages = [
                        { role: "system", content: "You are a helpful assistant. Remember: 1) Use emojis 😊, 2) Include URLs https://example.com, 3) Use \"quotes\" and 'apostrophes', 4) Use <html> tags." },
                        { role: "user", content: "Hello" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "系统消息 - 多语言",
                test: async (modelId) => {
                    const messages = [
                        { role: "system", content: "You are a multilingual assistant. Respond in the language of the user's message. 你是一个多语言助手。用用户消息的语言回复。" },
                        { role: "user", content: "你好，今天心情怎么样？" }
                    ];
                    return await runTest(modelId, messages);
                }
            }
        ]
    },
    {
        name: "用户消息测试",
        tests: [
            {
                name: "基本用户消息 - 字符串内容",
                test: async (modelId) => {
                    const messages = [
                        { role: "user", content: "Hello, how are you?" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 带名称（基本）",
                test: async (modelId) => {
                    const messages = [
                        { role: "user", content: "Hello, how are you?", name: "User1" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 带名称（数组内容）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { type: "text", text: "Can you explain quantum computing?" }
                            ],
                            name: "QuantumEnthusiast"
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 带名称（混合内容）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { type: "text", text: "What's in this image?" },
                                { type: "image_url", image_url: { url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Apple_II_Plus_cropped.jpg" } }
                            ],
                            name: "ImageAnalyst"
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 内容为数组（单个文本）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { type: "text", text: "Can you explain quantum computing?" }
                            ]
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 内容为数组（多个文本）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { type: "text", text: "I have two questions:" },
                                { type: "text", text: "1. What is AI?" },
                                { type: "text", text: "2. How does machine learning work?" }
                            ]
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 内容为数组（文本和图片URL）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { type: "text", text: "What's in this image?" },
                                { type: "image_url", image_url: { url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Apple_II_Plus_cropped.jpg" } }
                            ]
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 内容为数组（多个图片URL）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { type: "text", text: "Compare these two images:" },
                                { type: "image_url", image_url: { url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Apple_II_Plus_cropped.jpg" } },
                                { type: "image_url", image_url: { url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Apple_macintosh_lcII.jpg" } }
                            ]
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 混合 URL 和 Base64 图片",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { type: "text", text: "这两张图分别是什么" },
                                { type: "image_url", image_url: { url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Apple_II_Plus_cropped.jpg" } },
                                { type: "image_url", image_url: { url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" } }
                            ]
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 图片 URL 带详细信息（高细节）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { 
                                    type: "image_url", 
                                    image_url: { 
                                        url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Apple_II_Plus_cropped.jpg", 
                                        detail: "high" 
                                    } 
                                }
                            ],
                            name: "HighDetailImageUser"
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 图片 URL 带详细信息（低细节）",
                test: async (modelId) => {
                    const messages = [
                        { 
                            role: "user", 
                            content: [
                                { 
                                    type: "image_url", 
                                    image_url: { 
                                        url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Apple_macintosh_lcII.jpg", 
                                        detail: "low" 
                                    } 
                                }
                            ],
                            name: "LowDetailImageUser"
                        }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 空内容",
                test: async (modelId) => {
                    const messages = [
                        { role: "user", content: "" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 长文本内容",
                test: async (modelId) => {
                    const longContent = "I'm working on a complex project that involves machine learning, data analysis, and web development. The goal is to create a predictive model that can forecast market trends based on various economic indicators. We're using Python for the backend, TensorFlow for the machine learning components, and React for the frontend. The data is stored in a PostgreSQL database, and we're using Docker for containerization. One of the challenges we're facing is optimizing the model's performance for real-time predictions. Can you provide some advice on how to approach this problem, particularly in terms of model architecture and data preprocessing techniques?";
                    const messages = [
                        { role: "user", content: longContent }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 特殊字符",
                test: async (modelId) => {
                    const messages = [
                        { role: "user", content: "Can you explain these symbols: @#$%^&*()_+{}|:<>?~`-=[]\\;',./" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
            {
                name: "用户消息 - 多语言",
                test: async (modelId) => {
                    const messages = [
                        { role: "user", content: "你好，Comment allez-vous? Wie geht es Ihnen? こんにちは、お元気ですか？" }
                    ];
                    return await runTest(modelId, messages);
                }
            },
        ]
    }
];

async function runTest(modelId, messages) {
    try {
        const { data, latency } = await makeApiRequest(modelId, messages);
        return {
            success: true,
            message: data.choices[0].message.content,
            latency,
            parameters: { messages }
        };
    } catch (error) {
        error.parameters = { messages };
        throw error;
    }
}

// 导出测试组，以便在 unit_test.js 中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = messageTests;
} else {
    window.messageTests = messageTests;
}