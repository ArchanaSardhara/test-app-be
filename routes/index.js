module.exports = {
  playerList: (req, res) => {
    let query = "SELECT * FROM `players` ORDER BY id ASC"; // query database to get all the players

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  },
};