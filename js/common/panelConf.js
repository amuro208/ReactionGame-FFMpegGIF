var confDefault = {
	CMD_SOCKET_ID:1,
	CMD_SOCKET_IP:"127.0.0.1",
	CMD_SOCKET_PORT:9000,
	ROOT_PATH:"C:/AMURO/Workspace/ReActionGame/PROJECTS/Nissan/Repository",
}



	var PanelConf = function(id){
		Page.call(this,id);
		this.initialReady = false;
		this.useFlag = true;
		this.useCpuOpponent = true;
		this.multiUser = 2;
		this.keys = [
			'CMD_SOCKET_IP',
			'CMD_SOCKET_PORT',
			'CMD_SOCKET_ID',
			'ROOT_PATH'
		];

		var vlen = this.keys.length;
		var chk = true;
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			this[key] = confDefault[key];
		}


		this.dispalyObj.innerHTML = '<div class="full-popup-inner">\
		<div class="close-button" onclick="closeFullPopup(\''+this.dispalyId+'\')"></div>\
		<h1>CONFIGURATION</h1>\
		<div id="socketStatus"></div>\
		<div class="full-popup-body">\
		    <div class="form-group">\
		        <input type="text" class="form-control" id="CMD_SOCKET_IP"         placeholder="Upload URL">\
		    </div>\
		    <div class="form-group">\
		        <input type="text" class="form-control" id="CMD_SOCKET_PORT"    placeholder="Clear Board">\
		    </div>\
		    <div class="form-group">\
		        <input type="text" class="form-control" id="CMD_SOCKET_ID"  placeholder="Request User Queue">\
		    </div>\
		    <div class="form-group">\
		        <input type="text" class="form-control" id="ROOT_PATH"     placeholder="Save User Queue">\
		    </div>\
		  </div>\
		  <div class="full-popup-utils">\
		    <button onclick="tcsapp.conf.save()"         id = "btn-save"    class="btn btn-lg btn-default">Save</button>\
		    <button onclick="tcsapp.conf.default()"      id = "btn-default" class="btn btn-lg btn-default">Default</button>\
		    <button onclick="tcsapp.connectSocket()"     id = "btn-connect" class="btn btn-lg btn-default">Connect</button>\
		    <button onclick="tcsapp.tcssocket.quit()"    id = "btn-quit"    class="btn btn-lg btn-default">Quit</button>\
		  </div>\
		</div>';
	}

	PanelConf.prototype = Object.create(Page.prototype);
	PanelConf.prototype.constructor = PanelConf;
	PanelConf.prototype.init = function(){
		document.addEventListener("onSocketOpen",this.onSocketOpen.bind(this),false);
		document.addEventListener("onSocketClose",this.onSocketClose.bind(this),false);
		document.addEventListener("onSocketStatus",this.onSocketStatus.bind(this),false);
		//console.log("this.panel : "+this.panel.);
		var vlen = this.keys.length;
		var chk = true;
		if (typeof(Storage) !== "undefined") {
			for(var i = 0; i<vlen; i++){
				var key = this.keys[i];
				var value = localStorage.getItem(key);
				console.log("initial saved value ["+key+"] : "+value);
				if(value != null) this[key] = value;
				else chk = false;
			}
			this.initialReady = chk;
			if(chk){
				console.log("conf initialised");
			}else{
				console.log("conf default value");
			}
		}
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = this[key];
			this.setConfItem(key, value);
		}
	}

	PanelConf.prototype.save = function (){
		var vlen = this.keys.length;
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = this.getConfItem(key);
			localStorage.setItem(key, value);
			this[key] = value;
		}
		console.log("new values saved to local storage");
	}

	PanelConf.prototype.default = function (){
		var vlen = this.keys.length;
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = confDefault[key];
			localStorage.setItem(key, value);
			this.setConfItem(key, value);
			this[key] = value;
		}
		console.log("default values set to local storage");
	}

	PanelConf.prototype.setConfItem = function(id,value){
		if($$(id))$$(id).value = value;
	}
	PanelConf.prototype.getConfItem = function(id){
		if($$(id)!=null || $$(id)!=undefined)return $$(id).value;
		else return "";
	}
	PanelConf.prototype.onSocketOpen = function(e){
		this.hide();
	}
	PanelConf.prototype.onSocketClose = function(e){
		this.show();
	}
	PanelConf.prototype.onSocketStatus = function(e){

		$$("socketStatus").innerHTML = e.detail.msg;
	}
