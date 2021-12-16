const express = require('express');
const router = express.Router();
const jobsdbBL = require('../models/jobs/jobsdbBL');
const loginRouter = require('./loginRouter');
const { getRoleFromId, VerifcationStatus } = require('../helpers/auth');

//auth - checks token and role
const restrictto = async (req, res, next) => {
	var token = req.headers['x-access-token'];

	let respCallBack = async (resp) => {
		const resp2 = await resp;
		if (resp2.auth) {
			res.role = resp2.userRole;
			next();
		} else {
			res.status(resp2.status).send({ userRole: resp2.userRole });
		}
	};

	await VerifcationStatus(token, respCallBack);
};

router.route('landing/:id').get(async (req, resp) => {
	let data = {};
	data = await jobsdbBL.getJob(req.params.id);
	return resp.json(data);
});

router.use(restrictto);

router.route('/').get(async (req, resp) => {
	let data = {};
	['Admin', 'BD'].includes(resp.role)
		? (data = await jobsdbBL.getAllJobs())
		: (data = { status: 401, message: 'unauthorized' });

	return resp.json(data);
});

router.route('/joblist').get(async (req, resp) => {
	let data = {};
	['Admin', 'BD'].includes(resp.role)
		? (data = await jobsdbBL.getJobList())
		: (data = { status: 401, message: 'unauthorized' });

	return resp.json(data);
});

router.route('/:id').get(async (req, resp) => {
	let data = {};
	['Admin', 'BD'].includes(resp.role)
		? (data = await jobsdbBL.getJob(req.params.id))
		: (data = { status: 401, message: 'unauthorized' });

	return resp.json(data);
});

router.route('/').post(async (req, resp) => {
	let status = {};
	['Admin', 'BD'].includes(resp.role)
		? (status = await jobsdbBL.addJob(req.body))
		: (status = { status: 401, message: 'unauthorized' });

	return resp.json(status);
});

router.route('/:id').put(async (req, resp) => {
	let status = {};
	['Admin', 'BD'].includes(resp.role)
		? (status = await jobsdbBL.updateJob(req.params.id, req.body))
		: (status = { status: 401, message: 'unauthorized' });

	return resp.json(status);
});

router.route('/:id').delete(async (req, resp) => {
	let status = {};
	['Admin', 'BD'].includes(resp.role)
		? (status = await jobsdbBL.deleteJob(req.params.id))
		: (status = { status: 401, message: 'unauthorized' });

	return resp.json(status);
});

module.exports = router;
