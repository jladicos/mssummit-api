import * as styles from '../less/main.less'
import { request } from 'http'
import enigma from 'enigma.js'
import schema from './qlikSchema'

window.navController

const options = {    
    defaultView: 'hub'
}
window.navController = new WebsyNavigator(options)
window.navController.subscribe('show', (view, params) => {  
    
})
window.navController.subscribe('hide', view => {
    
})
window.navController.init()

function createApp () {
    const name = document.getElementById('newAppName').value
    getRequest(`/createapp/${name}`).then(response => {
        
    })
}

window.createApp = createApp

function getRequest (url) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {				
				resolve(xhr.responseText)
			}			
		}
		xhr.open('GET', url, true)
		xhr.send()
	})
}

const session = enigma.create({
	url: 'ws://localhost:19076/app/engineData',
	schema
})

session.open().then(global => {
	console.log(global);
	global.getDocList().then(docs => {
		console.log(docs);
		global.openDoc('ramen.qvf').then(app=>{
			const def = {
				qInfo: {
					qType:'mycustomobject'
				},
				name: 'blah blah',
				myCustomProp1:[
					{qStringExpression: `='There are ' & Count(DISTINCT Country) & ' countries'`}
				],
				qListObjectDef: {
					qDef: {
						qFieldDefs: ['Country']
					},
					qInitialDataFetch: [{qTop: 0, qLeft: 0, qWidth: 1, qHeight: 10000}]
				},
				myCusotmCube: {
					qHyperCubeDef: {
						qDimensions:[
							{
								qDef: {
									qFieldDefs: ['Country', 'Style']
								}
							}
						],
						qMeasures: [
							{
								qDef: {
									qDef: `Avg(Stars)`
								}
							}
						],
						qInitialDataFetch: [{qTop: 0, qLeft: 0, qWidth: 3, qHeight: 30}]
					}
				}
			}

			app.createSessionObject(def).then(model=>{
				console.log(model);
				model.getLayout().then(layout => {
					console.log(layout);
					model.getHyperCubeData(
						'/myCusotmCube/qHyperCubeDef', 
						[{qTop: 100, qLeft: 0, qWidth: 3, qHeight: 30}]
					).then(pages => {
						console.log(pages);
					})
				})
			})
		})
	})
})