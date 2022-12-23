var express = require('express');
var router = express.Router();
var pool = require("./pool")
var upload = require("./multer")
router.post('/addquestions', upload.any(), function (req, res) {
  console.log("FILES:", req.files)
  console.log("BODY:", req.body)
  pool.query("insert into questions (specializationid,questionno,question,subquestionno,subquestion,option1,option2,option3,option4,option5) values(?,?,?,?,?,?,?,?,?,?)", [req.body.specializationid, req.body.questionno, req.body.question, req.body.subquestionno, req.body.subquestion, req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.option5], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: false, 'msg': 'Server error' })
    }
    else {
      res.status(200).json({ result: true, 'msg': 'Submitted' })
    }
  })

})


router.get('/displayall', function (req, res) {
  pool.query("select Q.*,(select S.specialization from specialization S where S.specializationid=Q.specializationid) as specialization from questions Q", function (error, result) {
    if (error) {
      res.status(500).json({ result: [] })
    }
    else {
      res.status(200).json({ result: result })
    }
  })
})


router.post('/editquestions', function (req, res, next) {
  pool.query("update questions set specializationid=?,questionno=?,question=?,subquestionno,subquestion=?,option1=?,option2=?,option3=?,option4=?,option5=?,correctanswer=? where questionid=?", [req.body.specializationid, req.body.questionno, req.body.question, req.body.subquestionno, req.body.subquestion, req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.option5, req.body.correctanswer, req.body.questionid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: [] })
    }
    else {
      res.status(200).json({ result: result })
    }
  })
})

router.post('/deletequestion', function (req, res, next) {
  pool.query("delete from questions where questionid=?", [req.body.questionid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: false, 'msg': 'Server Error' })
    }
    else {
      res.status(200).json({ result: true, 'msg': 'Deleted' })
    }
  })
})


router.post('/fetchallquestion', function (req, res, next) {
  console.log(req.body.specializationid)
  pool.query("select Q.*,(select S.specialization from specialization S where S.specializationid=Q.specializationid) as specialization from questions Q where Q.specializationid=?", [req.body.specializationid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: [] })
    }
    else {
      res.status(200).json({ result: result })
    }
  })
})




module.exports = router;