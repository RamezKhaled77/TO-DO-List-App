let taskInput = document.querySelector("[type='text']")
let addTaskBtn = document.querySelector("#addTask");
let taskList = document.querySelector(".task-list");
let switchModeBtn = document.querySelector(".switch input");
let overLay = document.querySelector(".over-layer");
let popUp = document.querySelector(".pop-up");
let closePopUp = document.querySelector(".close");
let delTasksLsBtn = document.querySelector(".button");

const hideTheTasksLs = () => {
    if (tasks.length !== 0) {
        taskList.style.display = "flex";
    } else {
        taskList.style.display = "none";
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        switchModeBtn.setAttribute("checked", "");
        hideTheTasksLs();
    }
});
switchModeBtn.addEventListener("click", () => {
    toggleTheMode();
})

const toggleTheMode = () => {
    let isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

document.addEventListener("DOMContentLoaded", ()=> {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task));
        displayTasks();
        updateStats();
        hideTheTasksLs();
    }
})

let tasks = [] ;

const saveTask = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
const addTask = ()=> {
    if (taskInput.value === "") {
        return;
    } else {
        tasks.push({text: taskInput.value, completed: false})
        displayTasks();
        clearInput();
        updateStats();
        saveTask();
        hideTheTasksLs();
    }
}
const clearInput = () => {
    taskInput.value = "";
    taskInput.focus();
}
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    console.log({tasks});
    updateStats();
    saveTask();
    hideTheTasksLs();
}
const deleteTask = (i) => {
    tasks.splice(i, 1);
    displayTasks();
    updateStats();
    saveTask();
    hideTheTasksLs();
}
const editTask = (i) => {
    taskInput.value = tasks[i].text;
    deleteTask(i);
    displayTasks();
    updateStats();
    saveTask();
    hideTheTasksLs();
}
const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length
    const totalTasks = tasks.length;
    const progress = (completedTasks / totalTasks) * 100;
    const progressBar = document.querySelector(".progress-bar");
    progressBar.style.width = `${progress}%`;
    document.querySelector(".numbers").innerText = `${completedTasks} / ${totalTasks}`;
    
    if (tasks.length && completedTasks === totalTasks) {
        blaskConfetti();
        setTimeout(() => {
            overLay.style.zIndex = "999";
            overLay.style.opacity = "1";
            overLay.style.height = `${tasks.length <= 2 ? "calc(100% + (100vh - 100%))" : "100%"}`
            popUp.style.transform = "translateY(0)";
        }, 2000);
    }
    hideTheTasksLs();
}
const closeOverLay = () => {
    popUp.style.transform = "translateY(-100%)";
    overLay.style.opacity = "0";
    overLay.style.zIndex = "-1";
}
closePopUp.addEventListener("click", () => {
    closeOverLay();
})
delTasksLsBtn.addEventListener("click", () => {
    closeOverLay();
        tasks.splice(0,);
        saveTask();
        displayTasks();
        location.reload();
        hideTheTasksLs();
})
const displayTasks = () => {
    taskList.innerHTML = ""
    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.setAttribute("draggable", "true");
        listItem.innerHTML = `
        <div class="text ${task.completed ? 'completed' : ""}">
            <input type="checkbox" id="cbx${index}" class="chbx hidden-xs-up" ${task.completed ? "checked" : ""}>
            <label for="cbx${index}" class="cbx"></label>
            <p>${task.text}</p>
        </div>
        <div class="icons">
            <button id="edit" onclick="editTask(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
            <button id="delete" onclick="deleteTask(${index})"><i class="fa-solid fa-trash-can"></i></button>
        </div>`;
        listItem.addEventListener("change",() => toggleTaskComplete(index))
        taskList.append(listItem);

        listItem.addEventListener("dragstart", () => setTimeout(() => listItem.classList.add("dragging"), 0))
        listItem.addEventListener("dragend", () => listItem.classList.remove("dragging"))
        
        const initSortableList = (e) => {
            e.preventDefault();
            const draggingItem = taskList.querySelector(".dragging");
            const siblings = [...taskList.querySelectorAll("li:not(.dragging)")];
            let nextSibling = siblings.find(sibling => {
                return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
            });
            
            taskList.insertBefore(draggingItem, nextSibling);
        }

        taskList.addEventListener("dragover", initSortableList);
        taskList.addEventListener("dragenter",e =>  e.preventDefault());
    })
    hideTheTasksLs();
}

addTaskBtn.addEventListener("click", addTask);

const blaskConfetti = () => {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      };
      
      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ["star"],
        });
      
        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ["circle"],
        });
      }
      
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
}

// const clearTasksList = ()=> {

// }