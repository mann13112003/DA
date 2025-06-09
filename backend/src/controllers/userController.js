const userService = require("../services/userService.js");

let register = async (req, res) => {
  try {
    let data = await userService.registerService(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};

let login = async (req, res) => {
  try {
    let data = await userService.loginService(req.body);
    if(data.errCode === 0){
      // Thiết lập cookie HTTP-Only chứa token
      res.cookie('auth_token', data.token, {
        httpOnly: true,  // Cookie không thể truy cập bằng JavaScript
        secure: false, // process.env.NODE_ENV === 'production',  Chỉ gửi cookie qua HTTPS nếu ở môi trường production
        maxAge: 3600000 ,  // Cookie hết hạn sau 1 phút ms
        sameSite: 'Strict',  // Ngăn chặn CSRF (hoặc 'Lax' nếu bạn cần ít bảo mật hơn)
      });
    }
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};
let getCurrentUser = async (req, res) => {
  try {
    // req.user đã có sẵn từ middleware
    return res.status(200).json({
      user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    return res.status(400).json({ error: "Lỗi khi lấy user hiện tại" });
  }
};

let logout = async (req, res) => {
  try {
    res.clearCookie("auth_token");
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (e) {
    return res.status(400).json({ error: "Lỗi khi đăng xuất" });
  }
};

let getRiceTypes = async(req,res) => {
  try{
    let riceTypeList = await userService.getRiceTypeService();
    return res.status(200).json({riceTypeList})
  }catch(error){
    console.log(error)
    return res.status(400).json({error: error})
  }
}

let getPestDiseasesCategory = async(req,res) => {
  try{
    let pestDiseaseCategoryList = await userService.getPestDiseasesCategoryService();
    return res.status(200).json({pestDiseaseCategoryList})
  }catch(error){
    console.log(error)
    return res.status(400).json({error: error})
  }
}

let getPestDiseasesStages = async(req,res) => {
  try{
    let pestDiseaseStagesList = await userService.getPestDiseasesStagesService();
    return res.status(200).json({pestDiseaseStagesList})
  }catch(error){
    console.log(error)
    return res.status(400).json({error: error})
  }
}

let pestPrediction = async(req,res) => {
  try{
    let pestPredictionResult = await userService.pestPredictionService(req.body,req.files);
    return res.status(200).json({pestPredictionResult})
  }catch(error){
    console.log(error)
    return res.status(400).json({error: error})
  }
}
module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  getRiceTypes,
  getPestDiseasesCategory,
  getPestDiseasesStages,
  pestPrediction,
};
