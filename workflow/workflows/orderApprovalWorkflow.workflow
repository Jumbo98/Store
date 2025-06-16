{
	"contents": {
		"78c0b21b-8aa4-437f-8208-ed00afc346e7": {
			"classDefinition": "com.sap.bpm.wfs.Model",
			"id": "store.orderapprovalworkflow",
			"subject": "orderApprovalWorkflow",
			"name": "orderApprovalWorkflow",
			"documentation": "",
			"lastIds": "62d7f4ed-4063-4c44-af8b-39050bd44926",
			"events": {
				"11a9b5ee-17c0-4159-9bbf-454dcfdcd5c3": {
					"name": "Start changing a status"
				},
				"2798f4e7-bc42-4fad-a248-159095a2f40a": {
					"name": "EndEvent1"
				}
			},
			"activities": {
				"ccbf82b4-f684-41df-bc05-c8fa8cfae399": {
					"name": "setApproval"
				}
			},
			"diagrams": {
				"42fa7a2d-c526-4a02-b3ba-49b5168ba644": {}
			}
		},
		"11a9b5ee-17c0-4159-9bbf-454dcfdcd5c3": {
			"classDefinition": "com.sap.bpm.wfs.StartEvent",
			"id": "startevent1",
			"name": "Start changing a status"
		},
		"2798f4e7-bc42-4fad-a248-159095a2f40a": {
			"classDefinition": "com.sap.bpm.wfs.EndEvent",
			"id": "endevent1",
			"name": "EndEvent1"
		},
		"42fa7a2d-c526-4a02-b3ba-49b5168ba644": {
			"classDefinition": "com.sap.bpm.wfs.ui.Diagram",
			"symbols": {
				"df898b52-91e1-4778-baad-2ad9a261d30e": {},
				"53e54950-7757-4161-82c9-afa7e86cff2c": {},
				"58ba35a5-30c6-4f20-8f28-3562133ad6d9": {}
			}
		},
		"df898b52-91e1-4778-baad-2ad9a261d30e": {
			"classDefinition": "com.sap.bpm.wfs.ui.StartEventSymbol",
			"x": 100,
			"y": 100,
			"width": 32,
			"height": 32,
			"object": "11a9b5ee-17c0-4159-9bbf-454dcfdcd5c3"
		},
		"53e54950-7757-4161-82c9-afa7e86cff2c": {
			"classDefinition": "com.sap.bpm.wfs.ui.EndEventSymbol",
			"x": 643,
			"y": 100,
			"width": 35,
			"height": 35,
			"object": "2798f4e7-bc42-4fad-a248-159095a2f40a"
		},
		"62d7f4ed-4063-4c44-af8b-39050bd44926": {
			"classDefinition": "com.sap.bpm.wfs.LastIDs",
			"hubapireference": 1,
			"sequenceflow": 1,
			"startevent": 1,
			"endevent": 1,
			"usertask": 1,
			"servicetask": 1
		},
		"ccbf82b4-f684-41df-bc05-c8fa8cfae399": {
			"classDefinition": "com.sap.bpm.wfs.ServiceTask",
			"destination": "workflow-destination",
			"destinationSource": "consumer",
			"path": "/odata/v4/catalog/OrdersView(${ID})",
			"httpMethod": "PATCH",
			"requestVariable": "{“status_ID”: “APPROVED”}",
			"headers": [{
				"name": "Content-Type",
				"value": "application/json"
			}],
			"id": "servicetask1",
			"name": "setApproval"
		},
		"58ba35a5-30c6-4f20-8f28-3562133ad6d9": {
			"classDefinition": "com.sap.bpm.wfs.ui.ServiceTaskSymbol",
			"x": 326,
			"y": 100,
			"width": 100,
			"height": 60,
			"object": "ccbf82b4-f684-41df-bc05-c8fa8cfae399"
		}
	}
}