exports.handleUserDataInput = async (req, res) => {
  const token = req.cookies.token?.split(" ")[1];
  console.log(token);

  console.log(req.body);
  res.send("noice");
};
