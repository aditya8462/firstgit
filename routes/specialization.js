var express = require('express');
var router = express.Router();
var pool = require("./pool")
var upload = require("./multer")


router.post('/savespecialization', upload.single('icon'), function (req, res, next) {
  console.log(req.body)
  console.log(req.file)
  pool.query("insert into specialization(specialization,icon)values(?,?)", [req.body.specialization, req.myfilename], function (error, result) {

    if (error) {
      //  console.log(error)
      res.status(500).json({ result: false })
    }
    else {
      res.status(200).json({ result: true })
    }
  })
});
router.get("/displayall", function (req, res) {

  pool.query("select * from specialization", function (error, result) {
    if (error) {
      res.status(500).json({ result: [] })
    }
    else {
      res.status(200).json({ result: result })

    }

  })


})
router.post('/editspecialization', function (req, res, next) {

  pool.query("update specialization set specialization=? where specializationid=?", [req.body.specialization, req.body.specializationid], function (error, result) {

    if (error) {
      // console.log(error)
      res.status(500).json({ result: false, msg: 'Server Error' })
    }
    else {
      res.status(200).json({ result: true, msg: 'Edited' })
    }



  })

})


router.post('/editicon', upload.single("icon"), function (req, res, next) {

  pool.query("update specialization set icon=? where specializationid=?", [req.myfilename, req.body.specializationid], function (error, result) {

    if (error) {
      // console.log(error)
      res.status(500).json({ result: false, msg: 'Server Error' })
    }
    else {
      res.status(200).json({ result: true, msg: 'Edited' })
    }


  })

})

router.post('/deletespecialization', function (req, res, next) {

  pool.query("delete from  specialization  where specializationid=?", [req.body.specializationid], function (error, result) {

    if (error) {
      // console.log(error)
      res.status(500).json({ result: false, msg: 'Server Error' })
    }
    else {
      res.status(200).json({ result: true, msg: 'Deleted' })

    }

  })

})

router.post("/displaycoursebydepartmentid", function (req, res) {
  console.log(req.body)
  pool.query("select C.*, (select D.departmentname from department D where D.departmentid=C.departmentid) as department from course C where C.departmentid=?", [req.body.departmentid], function (error, result) {
    if (error) {
      // console.log(error)
      res.status(500).json({ result: [] })
    } else {
      // console.log(result)
      res.status(200).json({ result: result })
    }
  })
})

module.exports = router;