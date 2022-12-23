var express = require('express');
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
router.post('/adddoctor', upload.single("picture"), function (req, res, next) {
  console.log("FILE:", req.body)
  console.log("FILE:", req.file)
  pool.query("insert into doctor(doctorname,dob,gender,mobileno,emailid,specializationid,password,picture) values(?,?,?,?,?,?,?,?)", [req.body.doctorname, req.body.dob, req.body.gender, req.body.mobileno, req.body.emailid, req.body.specializationid, req.body.password, req.file.filename], function (error, result) {
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
  pool.query("select D.*,(select D.specializationid from specialization S where S.specializationid= D.specializationid) as specialization from doctor D", function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: [] })
    }
    else {
      res.status(200).json({ result: result })
    }


  });


});
router.post('/editdoctor', function (req, res, next) {
  console.log(req.body)
  pool.query("update doctor set doctorname=?,dob=?,gender=?,mobileno=?,emailid=?,specializationid=?  where doctorid=?", [req.body.doctorname, req.body.doctorid, req.body.dob, req.body.gender, req.body.mobileno, req.body.emailid, req.body.specializationid], function (error, result) {

    if (error) {
      console.log(error)
      res.status(500).json({ result: false, msg: 'Server Error' })
    }
    else {
      res.status(200).json({ result: true, msg: 'Edited' })
    }



  })

})
router.post('/editicon', upload.single("picture"), function (req, res, next) {

  pool.query("update doctor set picture=? where doctorid=?", [req.file.filename, req.body.doctorid], function (error, result) {

    if (error) {
      console.log(error)
      res.status(500).json({ result: false, msg: 'Server Error' })
    }
    else {
      res.status(200).json({ result: true, msg: 'Edited' })
    }



  })

})

router.post('/deletedoctor', function (req, res, next) {

  pool.query("delete from  doctor  where doctorid=?", [req.body.doctorid], function (error, result) {

    if (error) {
      console.log(error)
      res.status(500).json({ result: false, msg: 'Server Error' })
    }
    else {
      res.status(200).json({ result: true, msg: 'Deleted' })

    }



  })

})
router.post("/displaydoctorbyspecialization", function (req, res) {
  console.log(req.body)
  pool.query("select D.*, (select S.specialization from specialization S where S.specializationid=D.specializationid) as specialization from doctor D where D.specializationid=?", [req.body.specializationid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json({ result: [] })
    } else {
      console.log(result)
      res.status(200).json({ result: result })
    }
  })
})

router.post('/checkdoctorlogin', function (req, res, next) {
  pool.query("select * from doctor where emailid=?and password=?", [req.body.emailid, req.body.password], function (error, result) {
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



router.post('/addprescription', function (req, res, next) {
  console.log("FILE:", req.body)
  pool.query("insert into prescription(medicinename,instruction,day,customerid,doctorid) values ?", [req.body.formFields.map(item => [item.medicinename, item.instruction, item.day, item.customerid,item.doctorid])], function (error, result) {
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

router.post('/DisplayPrescriptionbycustomerid', function (req, res) {
  pool.query('select * from prescription where customerid=? and doctorid=?',[req.body.customerid,req.body.doctorid],function (error, result) {
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

module.exports = router