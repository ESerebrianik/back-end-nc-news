exports.getApi = (req, res) => {
    res.status(200).send({ message: "connected to the database" });
  };