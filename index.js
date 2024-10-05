const baseUrls = {
    "Baichuan": {
        "base_url": "https://api.baichuan-ai.com/v1",
        "chinese_name": "百川"
    },
    "DeepSeek": {
        "base_url": "https://api.deepseek.com",
        "chinese_name": "深度求索"
    },
    "Moonshot": {
        "base_url": "https://api.moonshot.cn/v1",
        "chinese_name": "月之暗面"
    },
    "OpenAI": {
        "base_url": "https://api.openai.com/v1",
        "chinese_name": "OpenAI"
    },
    "Qwen": {
        "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "chinese_name": "通义千问"
    },
    "StepFun": {
        "base_url": "https://api.stepfun.com/v1",
        "chinese_name": "阶跃星辰"
    },
    "Zhipu": {
        "base_url": "https://open.bigmodel.cn/api/paas/v4/",
        "chinese_name": "智谱"
    }
};

let baseUrl = '';
let apiKey = '';
let models = [];
let currentTestingModel = null;
let isExpanded = false;

document.addEventListener('DOMContentLoaded', () => {
    const baseUrlSelect = document.getElementById('baseUrlSelect');
    const customBaseUrl = document.getElementById('customBaseUrl');
    const apiKeyInput = document.getElementById('apiKey');
    const apiKeyMask = document.getElementById('apiKeyMask');

    // 添加选项到下拉菜单
    for (const [key, value] of Object.entries(baseUrls)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.chinese_name;
        baseUrlSelect.appendChild(option);
    }

    // 添加自定义选项
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = '自定义';
    baseUrlSelect.appendChild(customOption);

    // 默认选择 OpenAI
    baseUrlSelect.value = 'OpenAI';

    // 处理下拉菜单变化
    baseUrlSelect.addEventListener('change', () => {
        if (baseUrlSelect.value === 'custom') {
            customBaseUrl.classList.remove('hidden');
        } else {
            customBaseUrl.classList.add('hidden');
        }
    });

    // 处理 API Key 输入
    apiKeyInput.addEventListener('input', () => {
        const maxVisibleChars = Math.floor(apiKeyInput.offsetWidth / 8) - 3; // 估算可见字符数
        const visibleStars = '*'.repeat(Math.min(apiKeyInput.value.length, maxVisibleChars));
        apiKeyMask.textContent = visibleStars + (apiKeyInput.value.length > maxVisibleChars ? '...' : '');
    });

    apiKeyInput.addEventListener('focus', () => {
        apiKeyMask.style.display = 'none';
    });

    apiKeyInput.addEventListener('blur', () => {
        if (apiKeyInput.value) {
            apiKeyMask.style.display = 'block';
        }
    });

    // 点击遮罩层时显示实际的 API Key 并允许编辑
    apiKeyMask.addEventListener('click', () => {
        apiKeyMask.style.display = 'none';
        apiKeyInput.focus();
    });

    document.getElementById('fetchModels').addEventListener('click', fetchModels);
});

async function fetchModels() {
    const fetchButton = document.getElementById('fetchModels');
    const modelList = document.getElementById('modelList');
    
    fetchButton.disabled = true;
    fetchButton.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 inline-block align-text-bottom" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>获取中';

    // 清空之前的模型列表
    modelList.innerHTML = '';

    const baseUrlSelect = document.getElementById('baseUrlSelect');
    const customBaseUrl = document.getElementById('customBaseUrl');
    
    if (baseUrlSelect.value === 'custom') {
        baseUrl = customBaseUrl.value.trim();
    } else {
        baseUrl = baseUrls[baseUrlSelect.value].base_url;
    }
    apiKey = document.getElementById('apiKey').value;

    if (!baseUrl || !apiKey) {
        displayError('请选择服务商（或输入自定义 Base URL）并输入 API Key');
        resetFetchButton(fetchButton);
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/models`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        models = data.data;
        await Promise.all(models.map(model => pingModel(model.id)));
        sortAndDisplayModels();
    } catch (error) {
        displayError(`获取模型列表失败: ${error.message}`);
    } finally {
        resetFetchButton(fetchButton);
    }
}

function displayError(message) {
    const modelList = document.getElementById('modelList');
    modelList.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">错误：</strong>
            <span class="block sm:inline">${message}</span>
        </div>
    `;
}

function resetFetchButton(button) {
    button.disabled = false;
    button.textContent = '获取模型列表';
}

// 排序并显示模型列表
function sortAndDisplayModels() {
    models.sort((a, b) => {
        if (a.id === currentTestingModel) return -1;
        if (b.id === currentTestingModel) return 1;
        if (a.pingSuccess && !b.pingSuccess) return -1;
        if (!a.pingSuccess && b.pingSuccess) return 1;
        return a.latency - b.latency;
    });

    const modelList = document.getElementById('modelList');
    modelList.innerHTML = '';

    const modelGrid = document.createElement('div');
    modelGrid.className = 'grid grid-cols-1 gap-4 w-full';
    modelList.appendChild(modelGrid);

    models.forEach((model, index) => {
        const modelDiv = document.createElement('div');
        modelDiv.className = `flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 ${currentTestingModel && model.id !== currentTestingModel && !isExpanded ? 'hidden' : ''}`;
        modelDiv.innerHTML = `
            <div class="flex items-center space-x-3 mb-2">
                <span class="w-3 h-3 rounded-full flex-shrink-0 ${model.pingSuccess ? 'bg-green-500' : 'bg-red-500'}"></span>
                <span class="font-medium truncate flex-grow" title="${model.id}">${model.id}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 flex-shrink-0">${model.pingSuccess ? `${model.latency}ms` : 'N/A'}</span>
                <button onclick="startModelTest('${model.id}')" class="test-button text-gray-500 hover:text-gray-700 text-sm transition duration-300 flex-shrink-0">测试</button>
            </div>
        `;
        const hoverContent = model.pingSuccess 
            ? `返回结果: ${model.response.substring(0, 20)}${model.response.length > 20 ? '...' : ''}`
            : `错误: ${model.error}`;
        modelDiv.setAttribute('title', hoverContent);
        modelGrid.appendChild(modelDiv);
    });

    if (currentTestingModel) {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggleModels';
        toggleButton.className = 'mt-4 text-blue-500 hover:text-blue-700 transition duration-300';
        toggleButton.textContent = isExpanded ? '折叠模型列表' : '展开模型列表';
        toggleButton.onclick = toggleModelVisibility;
        modelList.appendChild(toggleButton);
    }
}

// Ping 模型
async function pingModel(modelId) {
    try {
        const startTime = Date.now();
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: "user", content: "Hello" }],
                max_tokens: 5
            })
        });

        if (response.ok) {
            const data = await response.json();
            const endTime = Date.now();
            const model = models.find(m => m.id === modelId);
            model.pingSuccess = true;
            model.latency = endTime - startTime;
            model.response = data.choices[0].message.content;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        const model = models.find(m => m.id === modelId);
        model.pingSuccess = false;
        model.latency = Infinity;
        model.error = error.message;
    }
}

// 更新切换按钮
function updateToggleButton() {
    const modelCard = document.querySelector('#modelList > div');
    let toggleButton = modelCard.querySelector('.toggle-button');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button col-span-1 sm:col-span-2 mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200';
    }

    if (models.length > 6) {
        toggleButton.textContent = '显示更多';
        toggleButton.onclick = () => {
            const hiddenItems = modelCard.querySelectorAll('.hidden');
            if (hiddenItems.length > 0) {
                hiddenItems.forEach(item => item.classList.remove('hidden'));
                toggleButton.textContent = '折叠';
            } else {
                Array.from(modelCard.children).forEach((item, index) => {
                    if (index >= 6 && !item.classList.contains('toggle-button')) {
                        item.classList.add('hidden');
                    }
                });
                toggleButton.textContent = '显示更多';
            }
        };
        modelCard.appendChild(toggleButton);
    } else if (toggleButton.parentNode) {
        toggleButton.parentNode.removeChild(toggleButton);
    }
}

// 测试模型
function startModelTest(modelId) {
    currentTestingModel = modelId;
    isExpanded = false;
    sortAndDisplayModels();
    const testButton = document.querySelector(`#modelList button[onclick="startModelTest('${modelId}')"]`);
    testButton.innerHTML = '<svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    testButton.disabled = true;
    
    // 清除之前的测试结果
    const existingResults = document.getElementById(`test-results-${modelId}`);
    if (existingResults) {
        existingResults.remove();
    }
    
    // 调用实际的测试函数
    testModel(modelId).then(() => {
        testButton.innerHTML = '测试';
        testButton.disabled = false;
    });
}

function toggleModelVisibility() {
    isExpanded = !isExpanded;
    sortAndDisplayModels();
}

// 在 unit_test.js 中修改 testModel 函数
async function testModel(modelId) {
    // ... 原有的测试逻辑 ...

    // 测试完成后，保持当前视图
    sortAndDisplayModels();
}