const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET || 'smart-canteen-secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const sanitizeUser = (user) => ({
  id: user._id,
  userId: user.userId,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  emailVerified: user.emailVerified
});

exports.register = async (req, res, next) => {
  try {
    const { userId, name, email, phone, password } = req.body;

    if (!userId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'userId, name, email and password are required'
      });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { userId }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Email or User ID already registered'
      });
    }

    await User.create({
      userId,
      name,
      email,
      phone,
      password,
      role: 'user',
      emailVerified: true
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful. You can login now.'
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Email verification is disabled in current setup'
    });
  } catch (error) {
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Email verification is disabled in current setup'
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const matched = await user.matchPassword(password);
    if (!matched) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = getToken(user);
    return res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.requestLoginOtp = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const user = await User.findOne({ userId: userId.trim() }).select('+loginOtpCode +loginOtpExpires');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.loginOtpCode = otp;
    user.loginOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'OTP generated for login. It is valid for 5 minutes.',
      devOtp: otp
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyLoginOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        error: 'User ID and OTP are required'
      });
    }

    const user = await User.findOne({ userId: userId.trim() }).select('+loginOtpCode +loginOtpExpires');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!user.loginOtpCode || user.loginOtpCode !== otp.trim() || !user.loginOtpExpires || user.loginOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    user.loginOtpCode = undefined;
    user.loginOtpExpires = undefined;
    await user.save();

    const token = getToken(user);
    return res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const user = await User.findOne({ phone: phone.trim() }).select('+passwordResetCode +passwordResetCodeExpires');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetCode = resetCode;
    user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP generated. It is valid for 10 minutes.',
      devResetCode: resetCode
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { phone, code, newPassword } = req.body;
    if (!phone || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Phone number, reset OTP and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findOne({ phone: phone.trim() }).select('+password +passwordResetCode +passwordResetCodeExpires');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!user.passwordResetCode || user.passwordResetCode !== code || !user.passwordResetCodeExpires || user.passwordResetCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset code'
      });
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: sanitizeUser(req.user)
    });
  } catch (error) {
    next(error);
  }
};

exports.ensureDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@canteen.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Canteen Admin';
  const adminUserId = process.env.ADMIN_USER_ID || 'ADMIN001';

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    return;
  }

  await User.create({
    userId: adminUserId,
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    emailVerified: true
  });

  console.log(`👤 Default admin created: ${adminEmail}`);
};
