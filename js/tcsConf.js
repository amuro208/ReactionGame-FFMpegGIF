var conf = {};


	conf.CMD_SOCKET_ID = 1;
	conf.CMD_SOCKET_IP = "192.168.0.2";
	conf.CMD_SOCKET_PORT = 9000;
	conf.ROOT_PATH = "N";
	conf.initialReady = false;

	conf.init = function(){
		if (typeof(Storage) !== "undefined") {
			if(localStorage.getItem("cmd_ip") != null)      this.CMD_SOCKET_IP   = localStorage.getItem("cmd_ip");
			if(localStorage.getItem("cmd_port") != null)    this.CMD_SOCKET_PORT = localStorage.getItem("cmd_port");
			if(localStorage.getItem("cmd_id") != null)      this.CMD_SOCKET_ID   = localStorage.getItem("cmd_id");
			if(localStorage.getItem("root_path") != null)    this.ROOT_PATH        = localStorage.getItem("root_path");

			this.initialReady = true;
		}
		this.setConfItem("cmd_ip",      this.CMD_SOCKET_IP);
		this.setConfItem("cmd_port",    this.CMD_SOCKET_PORT);
		this.setConfItem("cmd_id",      this.CMD_SOCKET_ID);
		this.setConfItem("root_path",this.ROOT_PATH);
		log(this.CMD_SOCKET_IP+":"+this.CMD_SOCKET_PORT+"    ID:"+this.CMD_SOCKET_ID)
	}

	conf.save = function (){
		localStorage.setItem("cms_evt_code", this.getConfItem("cms_evt_code"));
		localStorage.setItem("cms_ip",       this.getConfItem("cms_ip"));
		localStorage.setItem("cms_upload",   this.getConfItem("cms_upload"));

		localStorage.setItem("root_path",     this.getConfItem("root_path"));
		this.CMD_SOCKET_IP   = localStorage.getItem("cmd_ip");
		this.CMD_SOCKET_PORT = localStorage.getItem("cmd_port");
		this.CMD_SOCKET_ID   = localStorage.getItem("cmd_id");

		this.ROOT_PATH       = localStorage.getItem("root_path");
	}
	conf.default = function (){

	}
	conf.setConfItem = function(id,value){
		if($$(id))$$(id).value = value;
	}
	conf.getConfItem = function(id){
		if($$(id)!=null || $$(id)!=undefined)return $$(id).value;
		else return "";
	}


	// Utilities
