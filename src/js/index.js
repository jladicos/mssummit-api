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
	url: 'ws://localhost:19076/app/ramen',
	schema
})

session.open().then(global => {
	console.log(global);
	//put in the app_id here instead of ramen.qvf for real app
	global.openDoc('ramen.qvf').then(app =>{
		console.log(app);
	}) 
})