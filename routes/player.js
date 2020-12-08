const fs = require('fs');

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
  addPlayer: (req, res) => {
    if (!req.files) {
      return res.status(400).send({ message: "No files were uploaded." });
    }

    let message = '';
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;
    let user_name = req.body.user_name;
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    let fileName = uploadedFile.name.split('.')[0];
    image_name = user_name + '_' + fileName + '.' + fileExtension;

    let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + user_name + "'";

    db.query(usernameQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        return res.status(400).send({ message: "Username already exists" });
      } else {
        // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
          // upload the file to the /public/assets/img directory
          uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
            if (err) {
              return res.status(500).send(err);
            }
            // send the player's details to the database
            let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
              first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + user_name + "')";
            db.query(query, (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
              return res.status(200).send(result);
            });
          });
        } else {
          return res.status(400).send({ message: "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed." });
        }
      }
    });
  },
  getPlayer: (req, res) => {
    let playerId = req.params.id;
    let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  },
  editPlayer: (req, res) => {
    let playerId = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;
    if (req.files) {
      let getImageQuery = 'SELECT image,user_name from `players` WHERE id = "' + playerId + '"';

      db.query(getImageQuery, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        let image = result[0].image;
        fs.unlink(`public/assets/img/${image}`, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          let uploadedFile = req.files.image;
          let image_name = uploadedFile.name;
          let fileExtension = uploadedFile.mimetype.split('/')[1];
          let fileName = uploadedFile.name.split('.')[0];
          image_name = result[0].user_name + '_' + fileName + '.' + fileExtension;
          if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
              if (err) {
                return res.status(500).send(err);
              }
            });
            let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "', `image` = '" + image_name + "' WHERE `players`.`id` = '" + playerId + "'";
            db.query(query, (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
              return res.status(200).send(result);
            });
          }
        });
      });
    }
    else {
      let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      });
    }
  },
  deletePlayer: (req, res) => {
    let playerId = req.params.id;
    let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
    let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

    db.query(getImageQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let image = result[0].image;

      fs.unlink(`public/assets/img/${image}`, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        db.query(deleteUserQuery, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(result);
        });
      });
    });
  }
};
