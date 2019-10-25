var wwd1 = new WorldWind.WorldWindow("globe1");
var wwd2 = new WorldWind.WorldWindow("globe2");

// plota globo simples
wwd1.addLayer(new WorldWind.BMNGOneImageLayer());
wwd1.addLayer(new WorldWind.BMNGLandsatLayer());

wwd2.addLayer(new WorldWind.BMNGOneImageLayer());
wwd2.addLayer(new WorldWind.BMNGLandsatLayer());

//HEAT
// Named layer displaying Average Temperature data
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var layerName = "MOD_LSTD_CLIM_M";

// Called asynchronously to parse and create the WMS layer
var createLayer = function (xmlDom) {
	// Create a WmsCapabilities object from the XML DOM
	var wms = new WorldWind.WmsCapabilities(xmlDom);
	// Retrieve a WmsLayerCapabilities object by the desired layer name
	var wmsLayerCapabilities = wms.getNamedLayer(layerName);
	// Form a configuration object from the WmsLayerCapability object
	var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
	// Modify the configuration objects title property to a more user friendly title
	wmsConfig.title = "Average Surface Temp";
	// Create the WMS Layer from the configuration object
	var wmsLayer = new WorldWind.WmsLayer(wmsConfig);

	// Add the layers to WorldWind and update the layer manager
	wwd1.addLayer(wmsLayer);
	wwd2.addLayer(wmsLayer);
	wwd3.addLayer(wmsLayer);
	wwd4.addLayer(wmsLayer);
};

// Called if an error occurs during WMS Capabilities document retrieval
var logError = function (jqXhr, text, exception) {
	console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
};
// FIM HEAT

var ip = "secure-taiga-64188.herokuapp.com";
var socket = new WebSocket('wss://' + ip);

socket.onopen = function (event) {
	console.log('WebSocket is connected.');
};

socket.onmessage = function (e) {
	console.table(e.data);
	var obj = JSON.parse(e.data);
	console.table(obj);
	obj = JSON.parse(obj.utf8Data);
	if (obj.type == 'layer') {
		console.table(obj.type);
		$.get(serviceAddress).done(createLayer).fail(logError);
	} else {
		mudaMapa(obj);
	}
};


function mudaMapa(cord) {
	var position = new WorldWind.Position(cord.lat, cord.lon);
	wwd1.goTo(position);
	wwd2.goTo(position);
}
function responsividadeCanvas(width) {
	if (width < 800) {
		document.getElementById('globe1').style.width = (width - 50) + "px";
		document.getElementById('globe1').style.height = (width - 50) + "px";
		document.getElementById('globe2').style.width = (width - 50) + "px";
		document.getElementById('globe2').style.height = (width - 50) + "px";
	} else {
		document.getElementById('globe1').style.width = "500px";
		document.getElementById('globe1').style.height = "500px";
		document.getElementById('globe2').style.width = "500px";
		document.getElementById('globe2').style.height = "500px";
	}
}