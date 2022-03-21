const User = require("../../models/users.model.js");
const Question = require("../../models/questions.model.js");

const seed = async ({ users, questions }) => {
  await User.collection.drop();
  await Question.collection.drop();
  for (const user of users) {
    const newUser = new User(user);
    await newUser.save().catch((err) => console.log(err));
  }
  for (const question of questions) {
    const newQuestion = new Question(question);
    await newQuestion.save().catch((err) => console.log(err));
  }
};

module.exports = seed;
