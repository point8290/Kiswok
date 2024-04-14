(function () {
  console.log("test");
  let isTaskFormOpen = window.innerWidth > 768,
    isEditFormOpen = false,
    editTaskId = null;
  const createTaskButton = document.getElementById("createTask");
  const createTaskForm = document.getElementById("createTaskForm");
  const taskList = document.getElementById("taskList");
  const errorText = document.getElementById("errorText");
  const header = document.getElementById("header");
  const resetButton = document.getElementById("reset-button");
  const saveButton = document.getElementById("save-button");
  const mask = document.getElementById("mask");

  function resetForm() {
    const inputEles = Object.values(
      document.getElementsByClassName("form-input")
    );

    for (let inputEl of inputEles) {
      inputEl.value = "";
    }

    isEditFormOpen = false;
    editTaskId = null;
  }

  async function fileUpload(id, data) {
    const res = await fetch(`http://localhost:3000/upload/${id}`, {
      method: "POST",
      body: data,
    });
    const result = await res.json();

    loadTasks();
  }

  async function onSave(e) {
    e.preventDefault();

    let data = new FormData();
    const jsonData = {};
    const inputEles = Object.values(
      document.getElementsByClassName("form-input")
    );
    let callUpload = false;
    for (let inputEl of inputEles) {
      if (inputEl["name"] == "excelFile" || inputEl["name"] == "pdfFile") {
        let file = null;
        if (inputEl.files && inputEl.files.length > 0) {
          file = inputEl.files[0];
          callUpload = true;
        }
        data.append(inputEl["name"], file);
      } else {
        jsonData[inputEl["name"]] = inputEl.value;
      }
    }

    try {
      let res = null;
      console.log(data);
      if (isEditFormOpen && editTaskId) {
        res = await fetch(`http://localhost:3000/task/${editTaskId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });
      } else {
        res = await fetch("http://localhost:3000/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });
      }

      const result = await res.json();
      if (callUpload) fileUpload(result.id, data);
      else loadTasks();
      resetForm();
      hideForm();
    } catch (error) {
      console.error(error);
    }
  }

  function getColor(status) {
    if (status == "todo") {
      return "yellow";
    } else if (status == "completed") {
      return "green";
    } else {
      return "white";
    }
  }

  async function loadTasks() {
    try {
      const res = await fetch("http://localhost:3000/task");
      const data = await res.json();
      if (data.length == 0) {
        taskList.innerHTML = `<div id="errorText" style="display:block;" class="error-text">
                                No tasks found
                              </div>`;
        return;
      } else {
        const completedTasks = data.filter(
          (item) => item.status == "completed"
        );
        console.log(completedTasks);
      }

      const nodes = data?.map((item) => {
        const { id, title, description, status, pdfFile, excelFile } = item;
        const divTag = document.createElement("div");
        divTag.classList.add("task-item");
        taskList.innerHTML = "";
        divTag.innerHTML = `
            <div class="task-row">
              <div class="task-title-row"> 
                  ${
                    title
                      ? `
                        <div style="font-weight:bold; text-transform:capitalize; ">
                          ${title}
                        </div> 
                        `
                      : ""
                  }
                  ${
                    status
                      ? `
                        <div style="text-transform:capitalize; color:${getColor(
                          status
                        )} ">
                          ${status}
                        </div>
                            
                        `
                      : ""
                  }
                </div>
                <div style="padding-top:2px;">
                  ${description ? `<span> ${description}</span> &nbsp; ` : ""}
                </div>
                ${
                  pdfFile
                    ? `<div style="padding-top:2px;"> PDF: <a  class="link" target="_blank" href="http://localhost:3000/files/${pdfFile}"> ${pdfFile}</a> </div>`
                    : ""
                } 
                ${
                  excelFile
                    ? `<div style="padding-top:2px;"> EXCEL: <a class="link"  target="_blank" href="http://localhost:3000/files/${excelFile}"> ${excelFile} </a> </div>`
                    : ""
                }
            </div>

            <div class="action-button">
                <button id="edit-button" onclick="onEditTask(${id})"> <span class="fa fa-pencil"></span> </button>
                <button id="delete-button" onclick="onDeleteTask(${id})"> <span class="fa fa-solid fa-trash"></span> </button>
            </div>
        `;

        return divTag;
      });

      if (nodes?.length > 0) {
        errorText.setAttribute("style", "display:none");
        for (let item of nodes) {
          taskList.appendChild(item);
        }
      } else {
        errorText.setAttribute("style", "display:block");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function hideForm() {
    if (isTaskFormOpen) {
      header.setAttribute("style", "z-index:0");
      taskList.setAttribute("style", "z-index:0");
      mask.setAttribute("style", "display:none");
      createTaskForm.setAttribute("style", "display:none");
      isTaskFormOpen = false;
    }
  }

  function getImgURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  window.onEditTask = async (id) => {
    editTaskId = id;
    const res = await fetch(`http://localhost:3000/task/${id}`);
    const data = await res.json();

    if (!isTaskFormOpen) {
      showForm();
    }

    const inputEles = Object.values(
      document.getElementsByClassName("form-input")
    );

    for (let inputEl of inputEles) {
      if (inputEl["name"] == "excelFile" || inputEl["name"] == "pdfFile") {
        let fileType = "";
        if (inputEl["name"] == "excelFile") {
          fileType = "application/vnd.ms-excel";
        } else {
          fileType = "application/pdf";
        }
        const fileName = data[inputEl["name"]];

        getImgURL(`http://localhost:3000/files/${fileName}`, (imgBlob) => {
          let file = new File(
            [imgBlob],
            fileName,
            { type: fileType, lastModified: new Date().getTime() },
            "utf-8"
          );
          let container = new DataTransfer();
          container.items.add(file);
          inputEl.files = container.files;
        });
      } else {
        inputEl.value = data[inputEl["name"]];
      }
    }

    isEditFormOpen = true;
  };

  window.onDeleteTask = async (id) => {
    const res = await fetch(`http://localhost:3000/task/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    loadTasks();
  };

  const showForm = () => {
    if (!isTaskFormOpen) {
      header.setAttribute("style", "z-index:-1");
      taskList.setAttribute("style", "z-index:-1");
      mask.setAttribute("style", "display:block");
      createTaskForm.setAttribute("style", "display:block");
      isTaskFormOpen = true;
    }
  };
  window.addEventListener("resize", function () {
    isTaskFormOpen = window.innerWidth > 768;
  });
  createTaskButton.addEventListener("click", showForm);
  resetButton.addEventListener("click", resetForm);
  saveButton.addEventListener("click", onSave);
  mask.addEventListener("click", hideForm);

  loadTasks();
})();
