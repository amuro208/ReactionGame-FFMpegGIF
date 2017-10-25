
    var spawn    = require("child_process").spawn;
    var chokidar = require('chokidar');
    var path = require('path');
    var NUM_INTRO = 0;
    var NUM_OUTRO = 0;

	var photoWidth = 1920;
	var photoHeight = 1280;
	var outputWidth = 620;
	var outputHeight = 413;
	var edmWidth = 520;
	var edmHeight = 346;

	var user_pid = "user_123456789";
    var namingIndex = 0;
    var currentProcess = "none";
    var ff;

  //"D:/Workspace/2017/Nissan/ReActionGame/PROJECTS/Nissan";
    // One-liner for current directory, ignores .dotfiles

    // watcher.on('add', path => log(`File ${path} has been added`))
    // watcher.on('change', path => log(`File ${path} has been changed`))
    // watcher.on('unlink', path => log(`File ${path} has been removed`));
    function emptyLog(){
      $$("logSocket").innerHTML = "";
      $$("logFFmpeg").innerHTML = "";
    }
    function logSocket(msg){
  	  //console.log(msg);
  	  $$("logSocket").innerHTML+="\n"+msg;
  	  $$("logSocket").scrollTop  = $$("logSocket").scrollHeight;
	  logFFmpeg(msg);
      //console.log(msg);
  	}
    function logFFmpeg(msg){
      //console.log(msg);
      $$("logFFmpeg").innerHTML+="\n"+msg;
      $$("logFFmpeg").scrollTop  = $$("logFFmpeg").scrollHeight;
      //console.log(msg);
    }

    var fs = require("fs"),
    path = require("path");

    document.addEventListener("onSocketMessage",onSocketMessage);
    document.addEventListener("onSocketClose",onSocketClose);
    document.addEventListener("onSocketError",onSocketError);
    document.addEventListener("onSocketOpen",onSocketOpen);


    var onSocketOpen = function(e){

    }
    var onSocketError = function(e){

    }
    var onSocketClose = function(e){

    }
    var onSocketMessage = function(e){
      if(e.detail.cmd!="ADDPOINT")logSocket("message : "+e.detail.cmd+":"+e.detail.msg);

      if(e.detail.cmd == "READY"){
        //logFFmpeg(conf.ROOT_PATH+'/Temp');

        isGameReady = true;
        emptyLog();
        var arr = e.detail.msg.split("|")[0].split(",");
        cleanupTemp();
        setTimeout(setNewGameProcess(arr[2]),100);

      }else if(e.detail.cmd == "START"){
        isGameRunning = true;


      }else if(e.detail.cmd == "STOP"){
        isGameRunning = false;
        isGameReady = false;

      }else if(e.detail.cmd == "TIMEOUT"){
		    isGameRunning = false;
        isGameReady = false;
        setTimeout(function(){
          gifProcess();
        },2000);

      }else if(e.detail.cmd == "GAME_COMPLETE" || e.detail.cmd == "SUBMIT_ERROR"){

      }
    }
    var ffmpegInit = function(){
        logFFmpeg(conf.ROOT_PATH+'/Temp');




      var watcher = chokidar.watch(conf.ROOT_PATH+'/Temp', {ignored: /(^|[\/\\])\../}).on('all', (event, file) => {
        logFFmpeg("event : "+event);
        if(!isGameRunning)return;

        if(event == "add"){

          if (path.extname(file).toUpperCase() == ".JPG"){
              //console.log(event, file);
              var dest = conf.ROOT_PATH+"/Users/"+user_pid+"/image-"+zeroName(namingIndex)+".jpg";
              //var dest = "T:/AMURO/image-"+zeroName(namingIndex)+".jpg";
              //console.log("user  : "+dest);
              //moveFile(file,dest,function(err){console.log(err)});
              tweekingProcess(file,dest);
              namingIndex++;
          }
        }
      })
    }
   var  keyboardlistener = function(e){
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
          tcssocket.send("ALL","GAME_COMPLETE","-");
        break;

      }
    }

    function startProcess(options){
      ff = spawn(conf.ROOT_PATH+'/ffmpeg.exe',options);
      ff.stdout.on('data', (data) => {
        logFFmpeg("ff stdout : " + data);
      });

      ff.stderr.on('data', (data) => {
        logFFmpeg("ff stderr : " + data);
      });

      ff.on('close', (code) => {
        logFFmpeg("ff close : " + code);

    if(currentProcess == "gif"){
			setTimeout(function(){
				logSocket("process "+user_pid+": done GIF image");
				userEDMImage();
			},50);

		}if(currentProcess == "gif_p1"){
			setTimeout(function(){
				logSocket("process "+user_pid+": done GIF HD 1");
				gifProcessHD1();

			},50);

		}else if(currentProcess == "edm"){
			setTimeout(function(){
				logSocket("process "+user_pid+": done EDM image");
				overlayProcess();
			},50);

		}else if(currentProcess == "overlay"){
			setTimeout(function(){
				logSocket("process "+user_pid+": done Overlay WaterMark");
				tcssocket.send("ALL","GIF_DONE","-");
			},50);

		}else if(currentProcess == "tweek"){
			var dest = conf.ROOT_PATH+"/Users/"+user_pid+"/image-"+zeroName(namingIndex-1)+".jpg";
			$$("userPhotoPreview").src = dest;
			//gifPreview();
		}


      });

    }
    function stopProcess(){

	}

	function setNewGameProcess(pid)
	{
		namingIndex = 0;
		user_pid = pid;
		var USER_DIR = conf.ROOT_PATH+"/Users/"+user_pid;
		if (!fs.existsSync(USER_DIR)){
			fs.mkdirSync(USER_DIR);
		}
		logSocket("process "+user_pid+": New Game");
		//introRenamingFiles();
	}



    function zeroName(n){
		var nStr="";
		if(n<10){
			nStr = "00"+n;
		}else if(n<100){
			nStr = "0"+n;
		}else{
			nStr = ""+n;
		}
		return nStr;
    }




    //var gifStart = NUM_INTRO;
    //var gifEnd = namingIndex;
    //var gifPreviewId;
    function gifPreview(){


    }
    function gifDisplay(){
      var dest = conf.ROOT_PATH+"/Users/"+user_pid+"/image-"+zeroName(namingIndex-1)+".jpg";
      $$("userPhotoPreview").src = dest;

    }
    function copyFileWithSequence(source,num)
    {
      for(var i = 0; i<num;i++){

          var dest = conf.ROOT_PATH+"/Users/"+user_pid+"/image-"+zeroName(namingIndex)+".jpg";
          //console.log("intro : "+dest);
          namingIndex++;
          copyFile(source,dest,function(err){logFFmpeg(err)});
          //source.copyTo(dest,true);
      }
    }
    function introRenamingFiles()
	{
		logSocket("process "+user_pid+": introRenamingFiles");
		var source = conf.ROOT_PATH+"/Users/moods/intro.jpg";
		copyFileWithSequence(source,NUM_INTRO);
	}
	function outroRenamingFiles()
	{
		logSocket("process "+user_pid+": outroRenamingFiles");
		var source = conf.ROOT_PATH+"/Users/moods/outro.jpg";
		copyFileWithSequence(source,NUM_OUTRO);
	}
    function cleanupTemp()
    {
      logSocket("process "+user_pid+": cleanupTemp");
      var fileArr;
      var p = conf.ROOT_PATH+"/Temp";
      fs.readdir(p, function (err, files) {
          if (err) {
              throw err;
          }
          files.map(function (file) {
              return path.join(p, file);
          }).filter(function (file) {
              return fs.statSync(file).isFile();
          }).forEach(function (file) {
              //console.log("%s (%s)", file, path.extname(file));
              var source = file;
              deleteFile(source,function(){});
          });
      });
    }

    function copyFile(source, target, cb) {
        var cbCalled = false;

        var rd = fs.createReadStream(source);
        var wr = fs.createWriteStream(target);
        rd.on("error", done);
        wr.on("error", done);
        wr.on("close", function(ex) {
          done();
        });
        rd.pipe(wr);

        function done(err) {
          if (!cbCalled) {
            cb(err);
            cbCalled = true;
          }
        }
      }
    function moveFile(source, target, cb) {
      var exec = require('child_process').exec;
      exec('move '+source+' '+target, function(err, stdout, stderr) {
        if (err) {
            logFFmpeg("moveFile err : "+err);
            cb(err);
            return;
          }
          logFFmpeg("moveFile stdout : "+stdout);
          logFFmpeg("moveFile stderr : "+stderr);
       });
    }
    function deleteFile(source, cb) {
      fs.stat(source, function (err, stats) {
         logFFmpeg(stats);//here we got all information of file in stats variable
         if (err) {
             return logFFmpeg(err);
         }
         fs.unlink(source,function(err){
              if(err) return logFFmpeg(err);
              cb();
         });
      });
    }



    function isJPG(f){
			// if(f.exists && f.extension.toLowerCase() == "jpg"){
			// 	return true;
			// }
			return false;
		}
	function isPNG(f){
		// if(f.exists && f.extension.toLowerCase() == "png"){
		// 	return true;
		// }
		return false;
	}
	 function userEDMImage(){
		currentProcess = "edm";
		logSocket("process "+user_pid+": make EDM image");

		var input = conf.ROOT_PATH+"/Users/"+user_pid+"/image-000.jpg";
		var output = conf.ROOT_PATH+"/Final/"+user_pid+".png";
		var wm = conf.ROOT_PATH+"/Users/moods/overlay_wm.png";
		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);
		options.push("-i");
		options.push(wm);
		options.push("-filter_complex");
		options.push("overlay=0:0");
		options.push("-s");
		options.push(edmWidth+"x"+edmHeight);
		options.push(output);
		startProcess(options);
 	}

  //var factorRot =
  //var factorScale
  //var factorPos

  function tweekingProcess(input,output){
    currentProcess = "tweek";

		var pr = Math.random()<0.5?-1:1;
		var cr = Math.random()/20*pr;
		var cw = photoWidth*0.8-Math.random()*20;
		var ch = photoHeight*0.8-Math.random()*20;
		//var ch2:int = cw*(SET.PH/SET.PW);
		var cx = (photoWidth-cw+pr*Math.random()*5)/2;
		var cy = (photoHeight-ch+pr*Math.random()*5)/2;

		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);

		//options.push("-filter:v");
		//options.push("rotate="+cr+",crop="+cw+":"+ch+":"+cx+":"+cy+",scale="+outputWidth+":"+outputHeight);
    options.push("-vf");
		options.push("scale="+outputWidth+":"+outputHeight);

		options.push("-q:v");
		options.push("2");
		options.push(output);
		startProcess(options);

    }

/*
ffmpeg -i ./test/image-000.jpg -vf "fps=4,scale=620:-1:flags=lanczos,palettegen" -y palette.png
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse" -y output.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=1" -y output_dither_bayer_bayer_scale_1.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=2" -y output_dither_bayer_bayer_scale_2.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3" -y output_dither_bayer_bayer_scale_3.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=floyd_steinberg"     -y output_dither_floyd_steinberg.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=sierra2"             -y output_dither_sierra2.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=sierra2_4a"          -y output_dither_sierra2_4a.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=none"                -y output_dither_none.gif

*/

   function gifProcessHD1(){
     currentProcess = "gif_p1";
 		logSocket("process "+user_pid+": make palette image");
 		var input = conf.ROOT_PATH+"/Users/"+user_pid+"/image-%03d.jpg";
 		var output = conf.ROOT_PATH+"/Final/palette.png";
 		const options = [];
 		options.push("-y");
 		options.push("-v");
 		options.push("warning");
 		options.push("-i");
 		options.push(input);
    options.push("-pix_fmt");
    options.push("rgb24");
 		options.push("-vf");
 		options.push("fps=4,scale="+outputWidth+":-1:flags=lanczos,palettegen=stats_mode=diff");
 		options.push(output);
 		startProcess(options);
   }
   function gifProcessHD2(){
     currentProcess = "gif";
     logSocket("process "+user_pid+": make GIF image");
     var input = conf.ROOT_PATH+"/Users/"+user_pid+"/image-%03d.jpg";
     var input2 = conf.ROOT_PATH+"/Final/palette.png";
     var output = conf.ROOT_PATH+"/Final/"+user_pid+".gif";
     const options = [];
     options.push("-y");
     options.push("-v");
  		options.push("warning");
     options.push("-i");
     options.push(input);
     options.push("-i");
     options.push(input2);
     options.push("-pix_fmt");
     options.push("rgb24");
     options.push("-lavfi");
     options.push("fps=4,scale="+outputWidth+":-1:flags=lanczos,paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle");
     options.push(output);
     startProcess(options);
   }
	 function gifProcess(){
		currentProcess = "gif";
		logSocket("process "+user_pid+": make GIF image");
		var input = conf.ROOT_PATH+"/Users/"+user_pid+"/image-%03d.jpg";
		var output = conf.ROOT_PATH+"/Final/"+user_pid+".gif";
		const options = [];
		options.push("-y");
		options.push("-f");
		options.push("image2");
		options.push("-framerate");
		options.push("4");
		options.push("-i");
		options.push(input);
		//processArguments.push("-pix_fmt");
		//processArguments.push("rgb24");
		options.push("-vf");
		options.push("scale="+outputWidth+":"+outputHeight);
		options.push(output);
		startProcess(options);


		/*ffmpeg -i in.mp4 -i watermark.png -filter_complex "[0]fps=10,scale=320:-1:flags=lanczos[bg];[bg][1]overlay=W-w-5:H-h-5,palettegen" palette.png
ffmpeg -i in.mp4 -i watermark.png -i palette.png -filter_complex "[0]fps=10,scale=320:-1:flags=lanczos[bg];[bg][1]overlay=W-w-5:H-h-5[x];[x][2]paletteuse=dither=bayer:bayer_scale=3" output.gif*/
	}

	function gifProcess2(){
		currentProcess = "gif";
		logSocket("process "+user_pid+": make GIF image");
		var input = conf.ROOT_PATH+"/Users/"+user_pid+"/image-%03d.jpg";
		var output = conf.ROOT_PATH+"/Final/"+user_pid+".gif";
		const options = [];
		options.push("-y");
		options.push("-f");
		options.push("image2");
		options.push("-framerate");
		options.push("4");
		options.push("-i");
		options.push(input);
		//processArguments.push("-pix_fmt");
		//processArguments.push("rgb24");
		options.push("-vf");
		options.push("scale="+outputWidth+":"+outputHeight);
		options.push(output);
		startProcess(options);
	}
	function overlayProcess(){
		currentProcess = "overlay";
		logSocket("process "+user_pid+": make Overlay WaterMark");
		var input = conf.ROOT_PATH+"/Final/"+user_pid+".gif";
		var output = conf.ROOT_PATH+"/Final/"+user_pid+".gif";
		var wm = conf.ROOT_PATH+"/Users/moods/overlay_logo.png";
		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);
		options.push("-i");
		options.push(wm);
		options.push("-filter_complex");
		options.push("overlay=0:0");
		options.push(output);
		startProcess(options);

	}
	function overlayProcess2(){
		currentProcess = "overlay";
		logSocket("process "+user_pid+": make Overlay WaterMark");
		var input = conf.ROOT_PATH+"/Final/"+user_pid+".gif";
		var output = conf.ROOT_PATH+"/Final/"+user_pid+".gif";
		var wm = conf.ROOT_PATH+"/Users/moods/overlay_wm.png";
		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);
		options.push("-vf");
		options.push('"movie='+wm+' [watermark]; [in][watermark] overlay=0:0 [out]"');
		options.push(output);
		startProcess(options);
	}
