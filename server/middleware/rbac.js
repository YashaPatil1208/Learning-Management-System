/**
 * Role-Based Access Control middleware factory.
 *
 * Usage:
 *   router.get('/admin-only', authMiddleware, rbac('admin'), handler);
 *   router.get('/staff',      authMiddleware, rbac('admin', 'instructor'), handler);
 *
 * @param  {...string} allowedRoles  One or more role strings (admin | instructor | student)
 * @returns {Function} Express middleware
 */
function rbac(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const norm = (r) => (r === 'teacher' ? 'instructor' : r);
    const normalizedUserRole = norm(req.user.role);
    const normalizedAllowed = allowedRoles.map(norm);

    if (!normalizedAllowed.includes(normalizedUserRole)) {
      return res.status(403).json({
        message: `Forbidden. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
}

module.exports = rbac;
