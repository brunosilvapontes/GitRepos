var express = require('express');
var router = express.Router();

router.get('/:githubUsername', function(req, res, next) {
  console.log('entrei index')
  //res.render('index', { title: 'Express' });
  const username = req.params.githubUsername
  if (username && username.length > 1) return res.status(200).json({ field: req.params.githubUsername + ' ...' }).end()
  return res.status(400).json({Message: 'badd request ! ! !'}).end()
});

module.exports = router;
