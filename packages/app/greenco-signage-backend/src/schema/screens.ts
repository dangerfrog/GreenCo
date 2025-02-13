export default `
extend type HiveOrganisation {
	greenScreens: [GreenScreen] @relationship(type: "HAS_GREEN_SCREEN", direction: OUT)
}

type GreenScreen @auth(rules: [
	{operations: [READ, UPDATE], where: {organisation: {id: "$jwt.organisation"}}},
	{operations: [UPDATE, DELETE], bind: {organisation: {id: "$jwt.organisation"}}}
])  {
	id: ID! @id
	name: String
	networkName: String

	online: Boolean
	
	template: GreenScreenTemplate @relationship(type: "USES_TEMPLATE", direction: OUT)

	location: Location @relationship(type: "IN_LOCATION", direction: OUT)
	
	slots: [ScreenSlot] @relationship(type: "HAS_SLOT", direction: OUT)

	organisation: HiveOrganisation @relationship(type: "HAS_GREEN_SCREEN", direction: IN)
}


type ScreenSlot {
	id: ID! @id

	hostname: String
	online: Boolean

	agentVersion: String

	os: String
	ip: String

	memory: Float
	memoryUsed: Float
	cpus: Int
	
	width: Float
	height: Float
	
	resWidth: Float
	resHeight: Float
	orientation: Float

	templateSlot: TemplateSlot @relationship(type: "USES_SLOT", direction: OUT)

	tags: [ScreenTag] @relationship(type: "HAS_TAG", direction: OUT)
	screen: GreenScreen @relationship(type: "HAS_SLOT", direction: IN)
}

type ScreenTag {
	id: ID @id
	text: String
}

`