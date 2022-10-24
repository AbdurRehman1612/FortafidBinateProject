const express = require("express");
const router = express.Router();
const { upload } = require("../utils/utils");
const {
  AddTherapyAdmin,
  AddTherapy,
  getmyTherapy,
  AddtomyTherapy,
  showalltherapiesuser,
  showalltherapies,
  EditmyTherapy,
  EditTherapyAdmin,
  showtherapydetails,
  showinfusioncategory,
  showaddonscategory,
  showinjectionscategory,
  showtherapydetailsadmin,
  AddRatings,
} = require("../controller/therapiesController");
const { userAuth, therapistAuth } = require("../auth/auth");

// router.post('/addtherapy',therapistAuth, upload.single("imageName"), AddTherapy);
// router.post('/addtomytherapy',therapistAuth, AddtomyTherapy);
// router.get('/getmytherapy',therapistAuth, getmyTherapy);
// router.post('/editmytherapy',therapistAuth,upload.single("imageName"), EditmyTherapy);
// router.get('/showalltherapies', showalltherapies);
// router.get('/showtherapydetails', showtherapydetails);

router.post("/addtherapyadmin", upload.single("imageName"), AddTherapyAdmin); 
router.post("/addtherapy",therapistAuth,upload.single("imageName"),AddTherapy); 
router.post("/addtomytherapy", therapistAuth, AddtomyTherapy);
router.get("/getmytherapy", therapistAuth, getmyTherapy);
router.post("/edittherapyadmin", upload.single("imageName"), EditTherapyAdmin);
router.post("/editmytherapy",therapistAuth,upload.single("imageName"),EditmyTherapy);
router.get("/showalltherapiesuser", showalltherapiesuser);
router.get("/showalltherapies", therapistAuth, showalltherapies);
router.get("/showtherapydetails", showtherapydetails);
router.get("/showtherapydetailsadmin", showtherapydetailsadmin);

router.get("/showinfusioncategory", showinfusioncategory);
router.get("/showaddonscategory", showaddonscategory);
router.get("/showinjectionscategory", showinjectionscategory);

router.post("/addratings", userAuth, AddRatings);  //_id from frontend

module.exports = router;