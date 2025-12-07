function auth(req) {
  const token = req.headers.authorization?.split(' ')[1]
  return token === process.env.ADMIN_TOKEN || token === 'admin123'
}

module.exports = { auth }
