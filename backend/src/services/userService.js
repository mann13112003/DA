const db = require("../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imageKit = require('../config/imagekit.js');
const salt = bcrypt.genSaltSync(10);

const checkEmail = async(email) => {
  try {
    const user = await db.User.findOne({ where: { email: email } });
    if(user){
      return true;
    }else{
      return false;
    }
  } catch (e) {
    throw e;
  }
};

let hashPassword = async (password) => {
  try {
    let hashPass = bcrypt.hashSync(password, salt);
    return hashPass;
  } catch (e) {
    throw e;
  }
};

// Đăng ký
let registerService = async (data) => {
  try {
    let isExist = await checkEmail(data.email);
    if (isExist) {
      return {
        errCode: 1,
        errMessage: "Email exists, please try another email!",
      };
    }
    let hashPass = await hashPassword(data.password);
    await db.User.create({
      email: data.email,
      password: hashPass,
      userName: data.username,
      role: "user",
    });
    return {
      errCode: 0,
      errMessage: "Register success",
    };
  } catch (e) {
    console.error("Register error:", e);
    return {
      errCode: -1,
      errMessage: e.message,
    };
  }
};

// Đăng nhập
let loginService = async (data) => {
  try {
    let email = data.email;
    let password = data.password;
    if (!email || !password) {
      return {
        errMessage: "Missing input parameter!",
      };
    }
    let isExist = await checkEmail(email);
    if (!isExist) {
      return {
        errCode: 1,
        errMessage: "Your email is not exist in our system. Please try another email",
      };
    }
    let user = await db.User.findOne({
      attributes: ["id","email", "password","userName","role"],
      where: { email: email },
      raw: true,
    });
    if (!user) {
      return {
        errCode: 1,
        errMessage: "User not found!",
      };
    }
    let check = await bcrypt.compare(password, user.password);
    if (check) {
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.userName, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
      );
      return {
        errCode: 0,
        errMessage: "Login success",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.userName,
          role: user.role,
          
      }
      };
    } else {
      return {
        errCode: 1,
        errMessage: "Password wrong!",
      };
    }
  } catch (e) {
    throw e;
  }
};
let getRiceTypeService = async() => {
  try {
    let riceTypes = await db.RiceType.findAll();
    return ({
        errCode: 0,
        errMessage: 'Successfully fetched Rice Types',
        data: riceTypes,
    });
  } catch (e) {
      return ({
          errCode: -1,
          errMessage: 'Error while fetching Rice Types',
          error: e,
      });
  }
}

let getPestDiseasesCategoryService = async() => {
  try {
    let pestDiseasesCategory = await db.PestCategory.findAll();
    return ({
        errCode: 0,
        errMessage: 'Successfully fetched Pest Diseases Category',
        data: pestDiseasesCategory,
    });
  } catch (e) {
      return ({
          errCode: -1,
          errMessage: 'Error while fetching Pest Diseases Category',
          error: e,
      });
  }
} 

let getPestDiseasesStagesService = async() => {
  try {
    let pestDiseasesStages = await db.GrowthStage.findAll();
    return ({
        errCode: 0,
        errMessage: 'Successfully fetched Pest Diseases Stages',
        data: pestDiseasesStages,
    });
  } catch (e) {
      return ({
          errCode: -1,
          errMessage: 'Error while fetching Pest Diseases Stages',
          error: e,
      });
  }         
}
let pestPredictionService = async (data, files) => {
  if (!files || !files.image || !files.image.data) {
    return {
      errCode: 1,
      errMessage: "Chưa cung cấp ảnh hợp lệ",
    };
  }

  if (!data.userId || !data.predictionLabel || !data.confidenceScore) {
    return {
      errCode: 3,
      errMessage: "Thiếu thông tin đầu vào",
    };
  }

  let imageUrl = '';
  let imageFileId = '';

  try {
    const uploadRes = await imageKit.upload({
      file: files.image.data,
      fileName: files.image.name,
      folder: "/recognition",
    });
    imageUrl = uploadRes.url;
    imageFileId = uploadRes.fileId;
  } catch (err) {
    return {
      errCode: 2,
      errMessage: "Upload ảnh thất bại",
      error: err.message,
    };
  }

  const predictionResult = await db.PestPrediction.create({
    image_path: imageUrl,
    prediction_label: data.predictionLabel,
    confidence_score: data.confidenceScore,
    user_id: data.userId,
  });

  const pestInfo = await db.PestDisease.findOne({
    where: {
      scientific_name: data.predictionLabel,
    },
  });

  return {
    errCode: 0,
    errMessage: "Nhận diện và lưu thành công",
    data: {
      predictionResult,
      pest_info: pestInfo || null,
    },
  };
};

module.exports = {
  registerService,
  loginService,
  getRiceTypeService,
  getPestDiseasesCategoryService,
  getPestDiseasesStagesService,
  pestPredictionService,
};
