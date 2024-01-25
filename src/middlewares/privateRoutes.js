const privatesRoutes = (req, res, next) => {
	const allowedRoles = ['usuario', 'admin', 'premium'];
	console.log('req.session:');
	console.log(req.session);
	console.log('req:');
	console.log(req);
	if (!allowedRoles.includes(req.session.rol)) {
		return res.redirect('/api/session/login');
	}

	next();
};

export default privatesRoutes;
