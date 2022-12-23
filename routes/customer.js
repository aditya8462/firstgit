var express = require('express');
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
router.post('/addcustomer', function (req, res, next) {
  console.log("FILE:", req.body)
  console.log("FILE:", req.file)
  pool.query("insert into customer(name,state,city,emailid,dob,dop,mobileno,doctorid,password,confirmpassword) values(?,?,?,?,?,?,?,?,?,?)", [req.body.name, req.body.state, req.body.city, req.body.emailid, req.body.dob, req.body.dop, req.body.mobileno, req.body.doctorid, req.body.password, req.body.confirmpassword], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: false, msg: 'Server error..' })
    }
    else {
      console.log(result)
      res.status(200).json({ result: true, msg: 'Submitted' })
    }

  })
});

router.get('/DisplayAll', function (req, res) {
  pool.query("select * from customer ", function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: [] })
    }
    else {
      res.status(200).json({ result: result })
    }


  });
});
router.post('/checkcustomerlogin', function (req, res, next) {
  pool.query("select * from customer where emailid=?and password=?", [req.body.emailid, req.body.password], function (error, result) {
    if (error) {
      res.status(500).json({ result: false })
    }
    else {
      if (result.length == 0) {
        res.status(200).json({ result: false })
      }
      else {
        res.status(200).json({ result: true, data: result })
      }

    }

  })

});


router.post('/checkcustomermobilelogin', function (req, res, next) {
  console.log(req.body)
  pool.query("select * from customer where mobileno=?", [req.body.mobileno], function (error, result) {
    if (error) {
      res.status(500).json({ result: false })
    }
    else {
      console.log(result)
      if (result.length > 0) {
        res.status(200).json({ result: true, data: result })
      }
      else {
        res.status(200).json({ result: false })
      }

    }
  })
});




router.post('/insertcustomersymptom', function (req, res, next) {
  console.log("BODY:", req.body)

  pool.query("insert into symptoms (specializationid,questionno,subquestionno,subquestion,answer,customerid,doctorid,score) values ?", [req.body.answerArr.map(item => [item.specializationid, item.questionno, item.subquestionno, item.subquestion, item.answer, req.body.customerid, req.body.doctorid, item.score])], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: false, msg: 'Server error..' })
    }
    else {
      // console.log(result)
      res.status(200).json({ result: true, msg: 'Submitted' })
    }

  })
});


router.post('/DisplayCustomerbydoctorid', function (req, res) {
  pool.query('select * from customer where doctorid=?', [req.body.doctorid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: [] })
    }
    else {
      console.log(result)
      res.status(200).json({ result: result })
    }


  });
});

router.post('/displaysymptombycustomerid', function (req, res) {
  pool.query('select S.*,(select Q.question from questions Q where Q.questionno=S.questionno limit 1) as question from symptoms S where S.customerid=?', [req.body.customerid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: [] })
    }
    else {
      var tempArr=[]
      var arr = []
      result.map(item => {
        var str = []
        result.map(i => {
          if (item.questionno == i.questionno) {
            str.push(i.subquestion)
          }
        })
        if(!tempArr.includes(item.questionno)){
          tempArr.push(item.questionno)
          arr.push({ ...item, subquestion: str.join(", ") })
        }
      })
      console.log(arr)
      res.status(200).json({ result: arr })
    }
  });
});
module.exports = router;
