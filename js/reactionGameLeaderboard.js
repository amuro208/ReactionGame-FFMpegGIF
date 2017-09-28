var rb = {}

try{
  var ipcRender = require('electron').ipcRenderer;
      ipcRender.on('arduinoData', function(event, data){
        console.log("arduinoData : "+data);
      });
    ipcRender.send("arduinoCommand","STRAT :: ");
}catch(e){
    console.log(e);
}

try{
  const { spawn } = require('child_process');
  const child = spawn('cmd.exe',['/k','C:/Users/amuro/Dropbox/TCS/commands/test.bat']);


  child.stdout.on('data', (data) => {
    console.log("stdout : " + data);
  });

  child.stderr.on('data', (stderr) => {
  console.log("stdout : " + data);
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.log("close : " + code);
    }
  });



  const options = [];
  var cr = 0;
  var cw = 800;
  var ch = 500;
  var cx = 20;
  var cy = 20;
  options.push('-y');
  options.push('-i');
  options.push('test.mp4');
  options.push('-filter:v');
  options.push('rotate='+cr+',crop='+cw+':'+ch+':'+cx+':'+cy+',scale=1280:720');
  options.push('out.mp4');

  const ff = spawn('ffmpeg.exe',options);

  ff.stdout.on('data', (data) => {
    console.log("ff stdout : " + data);
  });

  ff.stderr.on('data', (data) => {
    console.log("ff stderr : " + data);
  });

  ff.on('close', (code) => {
    console.log("ff close : " + code);
  });
}catch(e){

}

rb.totalItems = 20;
rb.itemHeight = 44;
rb.newitem;
rb.refitem;
rb.userlist;
rb.newuserScore;
rb.newuserInfo;
rb.refindex = -1;
rb.refitem;
rb.isGameRunning = false;

rb.init = function(){
  document.addEventListener("onSocketMessage",rb.onSocketMessage);
  document.addEventListener("onSocketClose",rb.onSocketClose);
  document.addEventListener("onSocketError",rb.onSocketError);
  document.addEventListener("onSocketOpen",rb.onSocketOpen);
  window.addEventListener("keydown", rb.keyboardlistener);
  for(var i = 0;i<this.totalItems;i++){
    var item = document.createElement("DIV");
    item.id = "item"+i;
    item.className = "item-wrapper";
    item.innerHTML = '<div class="board-item"><div class="pos"></div><div class="team"><img class="team-flag" src = ""></div><div class="uname"></div><div class="score"></div></div>';
    $$("mContainerWrapper").appendChild(item);
  }
  rb.newitem = document.createElement("DIV");
  rb.newitem.id = "newitem";
  rb.newitem.innerHTML = '<div class="board-item"><div class="pos"></div><div class="team"><img class="team-flag" src = ""></div><div class="uname"></div><div class="score"></div></div>';
  rb.queryRanking();
}


rb.addNewUser = function(obj){
  var userinfo = obj.split("|")[0].split(",");
  $$("mContainerWrapper").appendChild(rb.newitem);
  rb.newitem.style.top = ""+(rb.userlist.length*rb.itemHeight)+"px";
  rb.newuserScore = 0;
  rb.newuserInfo = {"pos":0,"uname":userinfo[0],"flag":userinfo[1],"score":0,"user":1,"item":rb.newitem};
  rb.userlist.push(rb.newuserInfo);
  rb.setitem(rb.newitem,rb.newuserInfo);
  rb.refindex = -1;
  rb.refitem = null;
}


rb.addScore = function(){
  rb.newuserScore++;
  rb.newuserInfo.score = rb.newuserScore;
  rb.newitem.getElementsByClassName("score")[0].innerHTML = ""+rb.newuserScore;
  rb.userlist.sort(rb.sortOption);

  var uindex = rb.userlist.indexOf(rb.newuserInfo);
  var pos = 1;
  var score = rb.userlist[0].score;

  for(var i=0;i<rb.userlist.length;i++){
    if(score == rb.userlist[i].score){

    }else{
      pos++;
      score = rb.userlist[i].score;
    }
    rb.userlist[i].item.getElementsByClassName("pos")[0].innerHTML = ""+pos;
  }

  if(rb.refitem){
      TweenMax.to(rb.refitem,0.3,{marginTop:"0px",ease:Power2.easeOut});
  }

  if(uindex<rb.userlist.length-1){
    rb.refindex = uindex+1;
    rb.refitem = rb.userlist[rb.refindex].item;
    TweenMax.to(rb.newitem,0.3,{top:(uindex*rb.itemHeight)+"px",ease:Power2.easeOut});
    TweenMax.to(rb.refitem,0.3,{marginTop:rb.itemHeight+"px",ease:Power2.easeOut});
  }
}


rb.sortOption = function(a,b){
		var comparison1 = Number(b.score)-Number(a.score);
		if(comparison1 == 0){
			var comparison2 = a.uname.toLowerCase().localeCompare(b.uname.toLowerCase());
			if(comparison2 == 0){return b.uname.localeCompare(a.uname)};
			return comparison2;
		}else{
			return comparison1;
		}
}
rb.setitem= function(item,info){
  if(info == null){
    item.getElementsByClassName("pos")[0].innerHTML   = "";
    item.getElementsByClassName("team-flag")[0].src   = "";
    item.getElementsByClassName("score")[0].innerHTML = "";
    item.getElementsByClassName("uname")[0].innerHTML = "";
  }else{
    item.getElementsByClassName("pos")[0].innerHTML   = ""+info.pos;
    item.getElementsByClassName("team-flag")[0].src   = ""+"./img/flags/flag"+info.flag+".png";
    item.getElementsByClassName("score")[0].innerHTML = ""+info.score;
    item.getElementsByClassName("uname")[0].innerHTML = ""+info.uname;
  }
}

rb.keyboardlistener = function(e){
  switch (event.key) {
    case "r":
      tcssocket.send("ALL","READY","Donghoon Lee,2,12223344|");
    break;
    case "s":
      tcssocket.send("ALL","START","-");
    break;
    case "t":
      tcssocket.send("ALL","TIMEOUT","-");
    break;
    case "c":
      tcssocket.send("ALL","STOP","-");
    break;
    case "ArrowUp":
      rb.addScore();
      tcssocket.send("ALL","ADDPOINT","-");
    break;

  }
}



rb.onSocketOpen = function(e){

}
rb.onSocketError = function(e){

}
rb.onSocketClose = function(e){

}
rb.onSocketMessage = function(e){
  console.log("e.detail.cmd : "+e.detail.cmd+":"+e.detail.msg);
  console.log("rb.isGameRunning : "+rb.isGameRunning);
  if(e.detail.cmd == "READY"){

    if(rb.isGameRunning)return false;
      rb.addNewUser(e.detail.msg);


    }else if(e.detail.cmd == "START"){
       rb.isGameRunning = true;

    }else if(e.detail.cmd == "STOP"){
      rb.isGameRunning = false;

      if(rb.refitem){
          TweenMax.to(rb.refitem,0.3,{marginTop:"0px",ease:Power2.easeOut});
      }
      for(var i=0;i<rb.userlist.length;i++){
        rb.userlist[i].item.getElementsByClassName("pos")[0].innerHTML = ""+rb.userlist[i].opos;
      }
      var uindex = rb.userlist.indexOf(rb.newuserInfo);
      rb.userlist.splice(uindex,1);
      $$("mContainerWrapper").removeChild(rb.newitem);

    }else if(e.detail.cmd == "TIMEOUT"){
      rb.isGameRunning = false;
    }
}

rb.queryRanking = function(){
  var cmsURL = "http://"+conf.CMS_IP;
  var cmsUpload = conf.CMS_LIST;
    postAjax("http://192.168.0.2:81/qsrank.html", userData, function(readyState,status,data){
      log("readyState : "+readyState);
      log("status : "+status);
      log("data : "+data);
      if(readyState == 4){
          if(status == 200){
              rb.onResponseXML(data);
          }else if(status == 404){
              alert("Page Not Found");
              log("404");
          }else if(status == 500){
              alert("Server Error");
              log("500");
          }
      }
    });
}



rb.onResponseXML = function(data){
  var xml = parseXml(data);
  var list = xml.getElementsByTagName("rank");
  if(rb.userlist != null)delete   rb.userlist;

  rb.userlist = new Array();//xml.getElementsByTagName("rank");
  for(var i = 0;i<list.length;i++){
      if(i<this.totalItems)
      rb.userlist[i] = {"pos":list[i].getAttribute("no"),"opos":list[i].getAttribute("no"),"uname":list[i].getAttribute("name"),"flag":list[i].getAttribute("country"),"score":list[i].getAttribute("score"),"user":0,item:null};
  }
  rb.userlist.sort(rb.sortOption);
  for(var i = 0;i<rb.userlist.length;i++){
    rb.userlist[i].item = $$("item"+i);
    rb.setitem($$("item"+i),rb.userlist[i]);
  }

}
