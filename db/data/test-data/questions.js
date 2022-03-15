const fs = require("fs").promises;
const path = require("path");
const basedir = path.join(process.cwd(), "data");
const DATA_FILENAME = "data.json";
const QUESTION_DIR = "question_images";
const questionDir = path.join(basedir, QUESTION_DIR);
const MARK_SCHEME_DIR = "markscheme_images";
const markSchemeDir = path.join(basedir, MARK_SCHEME_DIR);

const getDirectories = async (source) =>
  (await fs.readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getImagesFromFolder = async (folder) =>
  (await fs.readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isFile())
    .filter((dirent) => path.extname(dirent.name) === ".png")
    .map((dirent) => dirent.name);

const getDataFromFile = async (path) => {
  const fileContents = await fs.readFile(path, "utf8");
  const data = JSON.parse(fileContents);
};

const mapToSchema = (arr) => {
  arr.map((q) => {
    const newObject = {};
    newObject.number = q.number;
    newObject.data = new Date(`${q.month} ${q.year}`);
    return {
      number: q.number,
      date: new Date(`${q.month} ${q.year}`),
      topic: q.topic,
      subject: "Physics",
      award: "IGCSE",
      exam_board: "CIE",
      tags: [],
      question_text: q.text,
      answer_text: q.answer,
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
