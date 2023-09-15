window.onload = function() {
    getTasks();
};

function saveTask(id, changed, elemType) {
    window.tasks.tasks[id][elemType] = changed.textContent;
    localStorage.setItem("tasks", JSON.stringify(window.tasks));
}

function saveDate(id, changed, elemType) {
    window.tasks.tasks[id][elemType] = changed.value;
    let status = checkPriority(window.tasks.tasks[id]["dueDate"]);
    
    window.tasks.tasks[id].status = status;

    const task = document.getElementById(id);
    statusIcon = task.querySelector(".status");
    
    if (status == 0) {
        statusIcon.classList.add("fa-exclamation");
        statusIcon.classList.add("overdue");

        statusIcon.classList.remove("due-soon");
        statusIcon.classList.remove("fa-check");
    } else if (status == 1) {
        statusIcon.classList.add("fa-exclamation");
        statusIcon.classList.add("due-soon");

        statusIcon.classList.remove("overdue");
        statusIcon.classList.remove("fa-check");
    } else if (status == 2) {
        statusIcon.classList.add("fa-check");

        statusIcon.classList.remove("overdue");
        statusIcon.classList.remove("due-soon");
    } else {
        statusIcon.classList.remove("overdue");
        statusIcon.classList.remove("due-soon");
        statusIcon.classList.remove("fa-check");
        statusIcon.classList.remove("fa-exclamation");
    }

    localStorage.setItem("tasks", JSON.stringify(window.tasks));
}

function getTasks() {
    //localStorage.removeItem("tasks");
    const obj = '{"taskCount":-1,"tasks": {"0":{"name":"Test", "desc":"This task is an experiment", "dueDate":"9/8/2023", "id":0, "status":0, "complete":"Started"}}}';
    var tasks = localStorage.getItem("tasks");
    if (typeof tasks !== typeof "string") {
        var tasks = obj;
        localStorage.removeItem("tasks");
        localStorage.setItem("tasks", tasks);
    }
    var tasks = JSON.parse(tasks);
    window.tasks = tasks;
    renderTasks();
}

function renderTasks() {
    for (let task in window.tasks.tasks) {
        let status = checkPriority(window.tasks.tasks[task].dueDate);
        renderTask(
                window.tasks.tasks[task].id,
                window.tasks.tasks[task].name,
                window.tasks.tasks[task].desc,
                window.tasks.tasks[task].dueDate,
                status
                )
    }
}

function renderTask(count, name, desc, date, status) {
    const tasks = document.getElementById("tasks");
    
    const taskbox = document.createElement("div");
    taskbox.classList.add("task-box");
    taskbox.id = count;
    window.tasks.taskCount = count;

    const task = document.createElement("div");

    const close = document.createElement("button");
    close.id = count;
    close.classList.add("task-close");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-x");
    close.appendChild(icon);

    const statusIcon = document.createElement("i");
    statusIcon.classList.add("fa-solid");
    statusIcon.classList.add("status");

    if (status == 0) {
        statusIcon.classList.add("fa-exclamation");
        statusIcon.classList.add("overdue");

        statusIcon.classList.remove("due-soon");
        statusIcon.classList.remove("fa-check");
    } else if (status == 1) {
        statusIcon.classList.add("fa-exclamation");
        statusIcon.classList.add("due-soon");

        statusIcon.classList.remove("overdue");
        statusIcon.classList.remove("fa-check");
    } else if (status == 2) {
        statusIcon.classList.add("fa-check");

        statusIcon.classList.remove("overdue");
        statusIcon.classList.remove("due-soon");
    } else {
        statusIcon.classList.remove("overdue");
        statusIcon.classList.remove("due-soon");
        statusIcon.classList.remove("fa-check");
        statusIcon.classList.remove("fa-exclamation");
    }


    const head = document.createElement("h2");
    const title = document.createElement("span");
    title.contentEditable = "True";
    const titleText = document.createTextNode(name);
    title.classList.add("task-input");
    title.appendChild(titleText);
    head.appendChild(title);

    const dueDate = document.createElement("h4");
    const due = document.createElement("input");
    due.type = "date";
    due.value = date;
    due.classList.add("task-input");
    dueDate.appendChild(due);

    const br = document.createElement("p");
    const brText = document.createTextNode("");
    br.appendChild(brText);

    const body = document.createElement("p");
    const taskDesc = document.createElement("span");
    taskDesc.contentEditable = "True";
    const descText = document.createTextNode(desc);
    taskDesc.classList.add("task-input");
    taskDesc.appendChild(descText);
    body.appendChild(taskDesc);
    
    task.appendChild(statusIcon);
    task.appendChild(close);
    task.appendChild(br);
    task.appendChild(head);
    task.appendChild(dueDate);
    task.appendChild(br);
    task.appendChild(body);

    taskbox.appendChild(task);
    tasks.appendChild(taskbox);

    close.addEventListener("click", function() {killTask(count)});
    title.addEventListener("input", function() {saveTask(count, this, "name")});
    due.addEventListener("input", function() {saveDate(count, this, "dueDate")});
    taskDesc.addEventListener("input", function() {saveTask(count, this, "desc")});
}

function checkPriority(dueDate) {
    const date = new Date();
    const due = new Date(dueDate);

    let diff = (due.getTime() - date.getTime()) / (1000 * 3600 * 24);

    if (diff >= 3) {
        status = 2;
    } else if (diff > 0) {
        status = 1;
    } else if (diff <= 0) {
        status = 0;
    } else {
        status = 3;
    }

    return status;
}

function addTask(
        name=document.getElementById("taskName"), 
        desc=document.getElementById("taskDesc"),  
        date=document.getElementById("dueDate")
) {
    let count = (parseInt(window.tasks.taskCount) + 1).toString();

    let status = checkPriority(date);

    renderTask(count, name.value, desc.value, date.value, status);

    window.tasks.tasks[count] = {"name":name.value, "desc":desc.value, "dueDate":date.value, "id":count, "status":status};
    localStorage.setItem("tasks", JSON.stringify(window.tasks));

    name.value = null;
    desc.value = null;
    date.value = null;
}

function killTask(id) {
    const taskbox = document.getElementById(id);
    taskbox.remove();
    window.tasks.tasks[id] = undefined;
    window.tasks.taskCount -= 1;
    localStorage.setItem("tasks", JSON.stringify(window.tasks));
}

function clearTasks() {
    if (confirm("Are you sure you want to clear your tasks?")) {
        for (let task in window.tasks.tasks) {
            killTask(window.tasks.tasks[task].id);
        }
        window.tasks.taskCount = -1;
        localStorage.setItem("tasks", JSON.stringify(window.tasks));
    }
}