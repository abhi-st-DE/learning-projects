const messagesDiv = document.getElementById('chat-messages');
const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const fileList = document.getElementById('file-list');
const codeContent = document.getElementById('code-content');
const currentFileName = document.getElementById('current-file-name');

let currentThreadId = null;

function addMessage(text, sender = 'system') {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function renderPlan(planData) {
    const div = document.createElement('div');
    div.className = 'plan-approval message system';
    
    const title = document.createElement('h4');
    title.innerText = "Task Plan Generated";
    
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'task-steps';
    
    if (planData.implementation_steps && Array.isArray(planData.implementation_steps)) {
        planData.implementation_steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'task-step';
            
            const fileSpan = document.createElement('div');
            fileSpan.className = 'task-file';
            fileSpan.innerHTML = `<strong>Step ${index + 1}:</strong> <code>${step.filepath}</code>`;
            
            const descSpan = document.createElement('div');
            descSpan.className = 'task-desc';
            descSpan.innerText = step.task_description;
            
            stepDiv.appendChild(fileSpan);
            stepDiv.appendChild(descSpan);
            stepsContainer.appendChild(stepDiv);
        });
    } else {
        const pre = document.createElement('pre');
        pre.innerText = JSON.stringify(planData, null, 2);
        stepsContainer.appendChild(pre);
    }
    
    const btn = document.createElement('button');
    btn.className = 'approve-btn';
    btn.innerText = 'Approve & Code';
    
    btn.onclick = () => {
        btn.disabled = true;
        btn.innerText = "Executing...";
        startStream(currentThreadId, null, true);
    };
    
    div.appendChild(title);
    div.appendChild(stepsContainer);
    div.appendChild(btn);
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function startChat() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    
    addMessage(prompt, 'user');
    promptInput.value = '';
    
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        currentThreadId = data.thread_id;
        
        startStream(currentThreadId, prompt, false);
    } catch (e) {
        addMessage("Error connecting to server.", "system");
    }
}

function startStream(threadId, prompt, resume) {
    let url = `/api/stream/${threadId}?resume=${resume}`;
    if (prompt) {
        url += `&prompt=${encodeURIComponent(prompt)}`;
    }
    
    const evtSource = new EventSource(url);
    
    evtSource.addEventListener("update", function(e) {
        const data = JSON.parse(e.data);
        addMessage(data.message, 'system');
        refreshFiles();
    });
    
    evtSource.addEventListener("interrupt", function(e) {
        const plan = JSON.parse(e.data);
        renderPlan(plan);
        evtSource.close();
    });
    
    evtSource.addEventListener("coder", function(e) {
        const data = JSON.parse(e.data);
        const idx = data.step;
        if (idx >= 0) {
            addMessage(`Coder finished step ${idx + 1}.`, "system");
            const steps = document.querySelectorAll('.task-step');
            if (steps && steps[idx]) {
                steps[idx].style.borderColor = "#10b981";
                steps[idx].style.backgroundColor = "#f0fdf4";
            }
        } else {
            addMessage("Coder finished step.", "system");
        }
        refreshFiles();
    });

    evtSource.addEventListener("done", function(e) {
        addMessage(e.data, 'system');
        refreshFiles();
        evtSource.close();
    });

    evtSource.addEventListener("error", function(e) {
        console.error("SSE Error", e);
        if (e.data) {
            addMessage(`Error: ${e.data}`, 'system error-message');
        } else {
            addMessage("Connection error or stream ended unexpectedly.", 'system error-message');
        }
        evtSource.close();
    });
}

async function refreshFiles() {
    if (!currentThreadId) return;
    try {
        const res = await fetch(`/api/files?thread_id=${currentThreadId}`);
        const data = await res.json();
        
        fileList.innerHTML = '';
        data.files.forEach(file => {
            const li = document.createElement('li');
            li.innerText = file;
            li.onclick = () => loadFile(file);
            fileList.appendChild(li);
        });
    } catch (e) {
        console.error("Failed to fetch files", e);
    }
}

async function loadFile(path) {
    if (!currentThreadId) return;
    try {
        const res = await fetch(`/api/files/${encodeURIComponent(path)}?thread_id=${currentThreadId}`);
        const data = await res.json();
        
        currentFileName.innerText = path;
        codeContent.innerText = data.content || '';
        
        // Extracted extension for prism
        const ext = path.split('.').pop();
        let lang = 'javascript';
        if (ext === 'py') lang = 'python';
        if (ext === 'html') lang = 'markup';
        if (ext === 'css') lang = 'css';
        if (ext === 'json') lang = 'json';
        
        codeContent.className = `language-${lang}`;
        if (window.Prism) {
            Prism.highlightElement(codeContent);
        }
    } catch (e) {
        console.error("Failed to load file content", e);
    }
}

sendBtn.addEventListener('click', startChat);
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startChat();
});

// Initial load
refreshFiles();
