var express = require("Express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.post('/addtimetable',function(req,res){
  console.log(req.body)
    pool.query("insert into timetables(specializationid, doctorid, day, fromtime, totime) values (?,?,?,?,?)", [req.body.specializationid, req.body.doctorid, req.body.day, req.body.fromtime, req.body.totime], function(error, result){
        if(error){
            res.status(500).json({result:false, msg:'Server Error!'})
        }
        else{
          console.log(result)

            res.status(200).json({result:result, msg:'Submitted Sucessfully'})
        }
    })
})

router.get('/DisplayAll', function (req, res) {
    pool.query("select T.*,(select S.specializationid from specialization S where S.specializationid= T.specializationid) as specialization,(select D.doctorid from doctor D where D.doctorid=T.doctorid)as doctorname from timetables T", function (error, result) {
      if (error) {
         console.log(error)
        res.status(500).json({ result: [] })
      }
      else {
        res.status(200).json({ result: result })
      }
  
  
    });
  
  
  });
  router.post('/edittimetable', function (req, res, next) {
    console.log(req.body)
    pool.query("update timetables set specializationid=?,doctorid=?,day=?,fromtime=?,totime=? where timetableid=?", [req.body.specializationid, req.body.doctorid, req.body.day,req.body.fromtime,req.body.totime], function (error, result) {
  
      if (error) {
        console.log(error)
        res.status(500).json({ result: false, msg: 'Server Error' })
      }
      else {
        res.status(200).json({ result: true, msg: 'Edited' })
      }
  
  
  
    })
  
  })
  
  
  router.post('/deletetimetable', function (req, res, next) {
  
    pool.query("delete from  timetables  where timetableid=?", [req.body.timetableid], function (error, result) {
  
      if (error) {
        console.log(error)
        res.status(500).json({ result: false, msg: 'Server Error' })
      }
      else {
        res.status(200).json({ result: true, msg: 'Deleted' })
  
      }
  
  
  
    })
  
  })
  
module.exports = router