import React, { useState, useContext } from 'react';
import { View, FingerPrint } from 'grommet-icons';
import { ResponsiveContainer, AreaChart, YAxis, XAxis, Tooltip, CartesianGrid, Line, Area } from 'recharts'
import { Box, Text } from 'grommet';
import { CampaignSingleContext } from '../context';
import moment from 'moment';
import { AnalyticBubble } from '../../../components/analytic-bubble/AnalyticBubble';

export const AnalyticsPage = () => {

	const { views, interactions, interactionTimeline } = useContext(CampaignSingleContext);

	return (
		<Box pad="xsmall" gap="small" flex>
			<Box direction="row" justify="between">

				<AnalyticBubble
					color="white"
					background="#627df6"
					icon={<View />}
					label="Appearances"
					value={views} />
				
				<AnalyticBubble
					color="white"
					background="#627df6"
					icon={<View />}
					label="People avg. daily"
					value={"0"} />
				
				<AnalyticBubble
					color="white"
					background="#627df6"
					icon={<View />}
					label="People avg. monthly"
					value={"0"} />

				<AnalyticBubble
					color="white"
					background="#627df6"
					icon={<FingerPrint />}
					label="Engagements"
					value={interactions} />

			</Box>

			<Box 
				overflow="hidden" 
				background="white" 
				round="xsmall" 
				elevation="small" 
				flex>
				<Box margin={{bottom: 'xsmall'}} pad={'xsmall'} background="accent-2" direction="row">
					<Text>Interactions</Text>
				</Box>
				<ResponsiveContainer width={'100%'}>
					<AreaChart
					
						data={interactionTimeline?.map((x) => ({
							...x,
							time: moment(new Date(x.time).getTime()).format('DD/MM')
						}))}
						margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
						>
						<defs>
							<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
							<stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
							</linearGradient>
						</defs>
						<XAxis minTickGap={25} dataKey="time" />
						<YAxis dataKey="interactions" />
						<Tooltip />
						<CartesianGrid stroke="#f5f5f5" />
						<Area type="monotone" dataKey="interactions" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
						{/* <Line type="monotone" dataKey={"interactions"}  stroke="#ff7300" yAxisId={0} /> */}
					</AreaChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	)
}