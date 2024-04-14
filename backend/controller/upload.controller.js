const tasks = require("../data/tasks");
const path = require("path");
const xlsx = require("xlsx");

const parseExcelFile = async (filename) => {
  const filepath = path.join(__dirname, `../public/${filename}`);
  const workbook = xlsx.readFile(filepath);
  let workbook_sheet = workbook.SheetNames;
  let workbook_response = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook_sheet[0]]
  );

  console.log(workbook_response);
};
exports.upload = (req, res, next) => {
  const taskId = req.params.id;
  const files = req.files;
  const index = tasks.findIndex((item) => item.id == taskId);
  if (index != -1) {
    let task = tasks[index];

    if (files["pdfFile"] && files["pdfFile"].length > 0) {
      console.log(files["pdfFile"][0].filename);
      task.pdfFile = files["pdfFile"][0].filename;
    }
    if (files["excelFile"] && files["excelFile"].length > 0) {
      task.excelFile = files["excelFile"][0].filename;
    }

    tasks[index] = task;
    if (task.excelFile) {
      parseExcelFile(task.excelFile);
    }
  }
};
