// 封装 API 请求函数
async function makeApiRequest(modelId, messages, parameters = {}) {
    const startTime = Date.now();
    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelId,
                messages: messages,
                ...parameters
            })
        });
        const endTime = Date.now();
        const latency = endTime - startTime;

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
        }

        const data = await response.json();
        return { data, latency };
    } catch (error) {
        throw error;
    }
}

// 定义测试组
const testGroups = [
    ...messageTests,
    // 可以在这里添加其他类型的测试组
];

async function testModel(modelId) {
    const testResultsContainer = document.createElement('div');
    testResultsContainer.id = `test-results-${modelId}`;
    testResultsContainer.className = 'mt-4 p-4 bg-white rounded-lg shadow';
    
    const testTitle = document.createElement('h3');
    testTitle.className = 'text-lg font-semibold mb-4';
    testTitle.textContent = `模型 ${modelId} 的测试结果`;
    testResultsContainer.appendChild(testTitle);

    const modelDiv = document.querySelector(`#modelList > div > div:has(span[title="${modelId}"])`);
    modelDiv.appendChild(testResultsContainer);

    for (const testSuite of messageTests) {
        const suiteContainer = document.createElement('div');
        suiteContainer.className = 'mb-6';
        const suiteTitle = document.createElement('h4');
        suiteTitle.className = 'text-md font-medium mb-2';
        suiteTitle.textContent = testSuite.name;
        suiteContainer.appendChild(suiteTitle);

        for (const test of testSuite.tests) {
            const testItem = document.createElement('div');
            testItem.className = 'mb-4';

            const testHeader = document.createElement('div');
            testHeader.className = 'flex items-center justify-between mb-1 cursor-pointer';

            const testNameContainer = document.createElement('div');
            testNameContainer.className = 'flex items-center flex-grow';

            const statusIndicator = document.createElement('span');
            statusIndicator.className = 'w-3 h-3 inline-block rounded-full bg-yellow-500 animate-pulse mr-2';

            const testName = document.createElement('span');
            testName.className = 'text-sm font-medium';
            testName.textContent = test.name;

            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'text-gray-500 ml-1';
            toggleIcon.innerHTML = `
                <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            `;

            const latencySpan = document.createElement('span');
            latencySpan.className = 'text-sm text-gray-500';
            latencySpan.textContent = '测试中';

            testNameContainer.appendChild(statusIndicator);
            testNameContainer.appendChild(testName);
            testNameContainer.appendChild(toggleIcon);

            testHeader.appendChild(testNameContainer);
            testHeader.appendChild(latencySpan);

            testItem.appendChild(testHeader);

            const collapsibleContent = document.createElement('div');
            collapsibleContent.className = 'hidden mt-2';

            const requestInfo = document.createElement('p');
            requestInfo.className = 'text-sm text-gray-600 bg-gray-100 p-2 rounded-md mb-2 whitespace-pre-line overflow-x-auto';
            const messagesString = JSON.stringify(test.test.toString().match(/messages = ([\s\S]*?);/)[1], null, 2);
            requestInfo.textContent = messagesString.replace(/^"|"$/g, '').replace(/\\n/g, '\n').replace(/\\"/g, '"');
            collapsibleContent.appendChild(requestInfo);

            const responseInfo = document.createElement('div');
            responseInfo.className = 'text-sm text-gray-700 bg-gray-200 p-2 rounded-md';
            collapsibleContent.appendChild(responseInfo);

            testItem.appendChild(collapsibleContent);

            testHeader.onclick = () => {
                collapsibleContent.classList.toggle('hidden');
                toggleIcon.innerHTML = collapsibleContent.classList.contains('hidden') 
                    ? `<svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                       </svg>`
                    : `<svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                       </svg>`;
            };

            suiteContainer.appendChild(testItem);

            // 开始测试
            test.test(modelId).then(result => {
                statusIndicator.className = 'w-3 h-3 inline-block rounded-full bg-green-500 mr-2';
                latencySpan.textContent = `${result.latency}ms`;
                responseInfo.textContent = result.message;
            }).catch(error => {
                statusIndicator.className = 'w-3 h-3 inline-block rounded-full bg-red-500 mr-2';
                latencySpan.textContent = 'Error';
                responseInfo.textContent = error.message;
            });
        }

        testResultsContainer.appendChild(suiteContainer);
    }
}

function displayTestResults(modelId, results) {
    const container = document.querySelector('.container.mx-auto.max-w-4xl');
    let resultsDiv = document.getElementById(`test-results-${modelId}`);
    
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = `test-results-${modelId}`;
        resultsDiv.className = 'mt-8 mb-8 bg-white rounded-2xl shadow-lg p-8 space-y-6';
        resultsDiv.innerHTML = `<h3 class="text-xl font-semibold mb-4">模型 ${modelId} 的测试结果：</h3>`;
        container.appendChild(resultsDiv);
    }

    resultsDiv.innerHTML = `<h3 class="text-xl font-semibold mb-4">模型 ${modelId} 的测试结果：</h3>`;

    results.forEach((group) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'mb-6';
        groupDiv.innerHTML = `<h4 class="text-lg font-medium mb-3">${group.name}：</h4>`;

        group.tests.forEach(test => {
            const testDiv = document.createElement('div');
            testDiv.className = 'flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 mb-3';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex items-center justify-between space-x-3 mb-2';
            headerDiv.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="w-3 h-3 rounded-full flex-shrink-0 ${test.success ? 'bg-green-500' : 'bg-red-500'}"></span>
                    <span class="font-medium truncate" title="${test.name}">${test.name}</span>
                </div>
                <span class="text-sm text-gray-500 flex-shrink-0">${test.latency}ms</span>
            `;

            const parametersDiv = document.createElement('div');
            parametersDiv.className = 'text-sm text-gray-600 bg-gray-100 p-2 rounded-md mb-2 whitespace-pre-line';
            parametersDiv.textContent = JSON.stringify(test.parameters, null, 2);

            const messageDiv = document.createElement('div');
            messageDiv.className = 'text-sm text-gray-700 bg-gray-200 p-2 rounded-md';
            messageDiv.textContent = test.message;

            testDiv.appendChild(headerDiv);
            testDiv.appendChild(parametersDiv);
            testDiv.appendChild(messageDiv);
            groupDiv.appendChild(testDiv);
        });

        resultsDiv.appendChild(groupDiv);
    });
}

// 导出函数以供其他文件使用
window.testModel = testModel;
window.makeApiRequest = makeApiRequest;