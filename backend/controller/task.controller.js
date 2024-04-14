const tasks = require("../data/tasks");

exports.getTasks = (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const index = tasks.findIndex((item) => item.id == id);

      if (index == -1) {
        return res.status(404).send({ message: "Task not found" });
      }

      return res.status(200).send(tasks[index]);
    } else {
      return res.status(200).send(tasks);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.createTask = (req, res, next) => {
  try {
    const task = req.body;
    if (task) {
      const id = Math.trunc(Math.random() * 10000000);
      task["id"] = id;
      tasks.push(task);

      return res.status(201).send(task);
    } else {
      return res.status(400).send({ message: "Please provide valid data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.updateTask = (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;

    if (id) {
      const index = tasks.findIndex((item) => item.id == id);

      if (index == -1)
        return res.status(404).send({ message: "Task not found" });

      tasks[index] = { ...tasks[index], ...data };

      return res.status(200).send(tasks[index]);
    } else {
      return res
        .status(400)
        .send({ message: "Please provide valid task id to update task" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.deleteTask = (req, res, next) => {
  try {
    const id = req.params.id;

    if (id) {
      const index = tasks.findIndex((item) => item.id == id);

      if (index == -1)
        return res
          .status(400)
          .send({ message: "Please provide valid task id to delete" });

      const deletedTask = tasks.splice(index, 1);
      return res.status(200).send(deletedTask);
    } else {
      return res
        .status(400)
        .send({ message: "Please provide valid task id to delete" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
