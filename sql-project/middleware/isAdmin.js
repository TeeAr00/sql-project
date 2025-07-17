function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('Decoded user:', req.user);
    console.log('Access denied:', req.user?.role);
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
}

module.exports = isAdmin;
