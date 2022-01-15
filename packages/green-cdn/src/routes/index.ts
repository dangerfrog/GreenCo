import { Router } from 'express'
import provisionRouter from './provision'
import distributeRouter from './distribute'
import telemetryRouter from './telemetry'
import identityRouter from './identity'

import { Driver } from 'neo4j-driver-core'
import { Pool, PoolClient } from 'pg'
import { promises } from 'dns'

export default async (driver: Driver, pgClient: Pool) => {

	const session = driver.session()

	const router = Router()

	router.use(async (req, res, next) => {

		let ip = (req.ip || req.socket.remoteAddress)?.replace('::ffff:', '')
        if(!ip) return res.send({error: "No IP, strange"});

        const [ host ] = await promises.reverse(ip);

		(req as any).hostname = host;
		next();
		
	})

	router.use(`/telemetry`, await telemetryRouter(session, pgClient))
	router.use('/provision', provisionRouter(session))
	router.use('/distribute', distributeRouter(session))

	router.use(`/identity`, await identityRouter(session))
	return router
}