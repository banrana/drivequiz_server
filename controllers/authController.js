const userModel = require('../models/userModel');
const ResHand = require('../helper/ResHandle');
const bcrypt = require('bcrypt');
const sendMail = require('../helper/sendmail');

exports.getMe = async (req, res) => {
  ResHand(res, true, req.user);
};

exports.login = async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return ResHand(res, false, "Hãy nhập đầy đủ thông tin");
  }
  let user = await userModel.findOne({ username: username });
  if (!user) {
    return ResHand(res, false, "username hoặc password không đúng");
  }
  let result = bcrypt.compareSync(password, user.password);
  if (result) {
    let token = user.getJWT();
    res.cookie('token', token, {
      expires: new Date(Date.now() + 24 * 3600 * 1000),
      httpOnly: true
    });
    res.redirect('/?username=' + user.username);
  } else {
    ResHand(res, false, "username hoặc password không đúng");
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.render('profile', { user: user });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedUserInfo = {
      username: req.body.username,
      email: req.body.email
    };
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedUserInfo, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng để cập nhật" });
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật thông tin người dùng" });
  }
};

exports.register = async (req, res) => {
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: ["USER"]
    });
    await newUser.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.status(404).send(error);
  }
};

exports.resetPassword = async (req, res) => {
  let user = await userModel.findOne({
    ResetPasswordToken: req.params.token
  });
  if (!user) {
    return res.status(404).send("URL không hợp lệ");
  }
  user.password = req.body.password;
  user.ResetPasswordToken = undefined;
  user.ResetPasswordExp = undefined;
  await user.save();
  res.status(200).send("Đổi pass thành công");
};

exports.forgotPassword = async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("Email không tồn tại");
  }
  let token = user.genTokenResetPassword();
  await user.save();
  let url = `http://localhost:3000/auth/ResetPassword/${token}`;
  try {
    await sendMail(user.email, url);
    res.status(200).send("Gửi mail thành công");
  } catch (error) {
    res.status(404).send(error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    if (bcrypt.compareSync(req.body.oldpassword, req.user.password)) {
      let user = req.user;
      user.password = req.body.newpassword;
      await user.save();
      ResHand(res, true, "Cập nhật mật khẩu thành công");
    } else {
      ResHand(res, false, "Mật khẩu cũ không đúng");
    }
  } catch (error) {
    console.error("Lỗi khi thay đổi mật khẩu:", error);
    ResHand(res, false, "Đã xảy ra lỗi khi thay đổi mật khẩu");
  }
};