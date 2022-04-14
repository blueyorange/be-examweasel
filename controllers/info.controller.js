const info = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
module.exports = info;
