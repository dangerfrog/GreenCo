import { FileStore } from "../de-file-store"
import { Pool } from 'pg';
import { Channel } from 'amqplib'

export default async (fs: FileStore, pool: Pool, channel: Channel) => {

	const client = await pool.connect()

	return {
		Mutation: {
			updateSlotClient: async (parent: any, {id, version}: any, context: any, info: any) => {
				return channel.sendToQueue(`GREEN-MACHINE:UPDATE`, Buffer.from(JSON.stringify({slot: id, version: version || 'latest'})))
			},
			pushScheduleUpdate: async (parent: any, {schedule}: any, context: any, info: any) => {
				return channel.sendToQueue(`GREEN-SCREEN:SCHEDULE:RELOAD`, Buffer.from(JSON.stringify({schedule: schedule})))
			}

		},
		Location: {
			cameraAnalytics: async (parent: any) => {
				const res = await client.query(
					`SELECT properties, timestamp FROM green_screen_telemetry WHERE event=$1 AND source=$2`,
					['camera-yolo', 'camera', ]
				)
				return res.rows.map(row => {
					return {
						timestamp: row.timestamp,
						results: row.properties?.results?.map((x: any) => ({name: x.name, confidence: x.confidence}))
					}
				})
			}
		},
		Campaign: {
			interactions: async (root: any) => {
				const res=  await client.query(
					`SELECT COUNT(*) as interactions FROM green_screen_telemetry WHERE event=$1 AND source = $2 `, 
					['campaign-interaction', `asset://${root.assetFolder}`])
				return res.rows?.[0]?.interactions || 0
			},
			interactionTimeline: async (root: any) => {
				const res=  await client.query(
					`with data as (
						select 
						coalesce (COUNT(*), 0) as cnt,
						time_bucket_gapfill('30 minutes', "timestamp") as time 
						from green_screen_telemetry 
						where "event"=$1 AND source=$2 and 
						"timestamp" < now() and "timestamp" > now() - interval '1 week'
						group by time
					)
					select time, SUM(cnt) over (order by time) as interactions from data`,
					// `SELECT "timestamp" as time, SUM(COUNT(*)) OVER(ORDER BY "timestamp") as interactions FROM  green_screen_telemetry WHERE event=$1 AND source=$2 group by "timestamp"`, 
					['campaign-interaction', `asset://${root.assetFolder}`])
				return res.rows
			},
			views: async (root: any) => {
				const res=  await client.query(
					`SELECT COUNT(*) as views FROM green_screen_telemetry WHERE event=$1 AND (properties -> 'id')::text = $2 `, 
					['campaign-play', `"${root.assetFolder}"`])

				console.log(res)
				return res.rows?.[0]?.views || 0
			},
			assets: async (root: any, ) => {
				console.log(root)
				try{
					return await fs.lsAsset(root.id)

				}catch(e){
					return []
				}
			}
		}	
	}
}