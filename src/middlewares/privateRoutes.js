const privatesRoutes = async (req, res, next) => {
	try {
		const allowedRoles = ['usuario', 'admin', 'premium'];

		console.log('req.session:');
		console.log(req.session);
		if (!allowedRoles.includes(req.session.rol)) {
			return res.redirect('/api/session/login');
		}

		next();
	} catch (error) {
		console.error('Error en el middleware privatesRoutes:', error);
		res.status(500).json({ success: false, error: 'Error en el servidor' });
	}
};
