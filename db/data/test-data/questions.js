const fs = require("fs").promises;
const path = require("path");
const basedir = path.join(process.cwd(), "data");
const DATA_FILENAME = "data.json";

const getDirectories = async (source) =>
  (await fs.readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getDataFromFile = async (path) => {
  const fileContents = await fs.readFile(path, "utf8");
  return JSON.parse(fileContents);
};

const mapToSchema = (arr) => {
  arr.map((q) => {
    const newObject = {};
    newObject.number = q.number;
    newObject.data = new Date(`${q.month} ${q.year}`);
    return {
      number: q.number,
      date: new Date(`${q.month} ${q.year}`),
      subject: "Physics",
      award: "IGCSE",
      exam_board: "CIE",
      tags: [],
      question_text: q.text,
      answer_text: answer,
      description: "NO DESCRIPTION",
    };
  });
};

const getQuestions = async (sourceDir) => {
  const dirs = (await getDirectories(basedir)).map((dir) =>
    path.join(basedir, dir)
  );
  dirs.forEach((dir) => {
    getDataFromFile(path.join(dir, DATA_FILENAME));
  });
};

getQuestions(basedir);
