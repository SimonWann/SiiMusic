var isLogin = false;
var audio = $('#ad1')[0];
var ex = true;
var pause = true;
var account = {};
var profile = {};
var playList = [];
var listUrl = [];
var playIndex = 0;
var songId = 0;
var likeMusic = [];
var currentIndex = 0;
var currentComments = {};
var playlistId = [];
var collectList = [];
var songListIndex = 0;
var ids = [];
var isFm = 0;
var lyric = [];

$.ajax({
    url:'http://simonwann.vipgz1.idcfengye.com/login/status',
    success:function(){
        isLogin = true;
    },
    error:function(){
        isLogin = false;
    }
});
$(window).on('resize',function(){
    var x = $('#volume')[0].offsetLeft;
    $('#volume2').css('left', x - 69 +'px')
    
});
audio.autoplay = true;
$('#play').on('click',function(event){
    console.log(audio.paused);
    console.log('aaas'+audio.currentSrc);
    if(pause){
        audio.play();
        pause = false;
    } else {
        audio.pause();
        pause = true;
    }   
    var color = $('#play').css('color');
    if( ex === true){
        $('#play').css('color','#5cb85c');
        ex = false;
    } else {
        $('#play').css('color','rgb(51, 51, 51)');
        ex = true;
    }  
});

//定时器，非常重要
setInterval(() => {
    var hasCompleted = audio.currentTime/audio.duration*100;
    // console.log(hasCompleted);
    $('#completedP').css('width',hasCompleted+"%");
    $('#completedP').attr('aria-valuenow',hasCompleted);
    if(audio.paused === false){
        $('#play').css('color','#5cb85c');
        ex = false;
    }
    // console.log(audio.ended);
    songId = playList[playIndex].id;
    console.log('isFm = ' + isFm);
    if( isFm =1 ){
        if( playIndex >= playList.length ){
            
            personalFm();
        }
    }

   if(audio.ended){
    $('#favoriteH').css('color','#333');
    playIndex++;
    currentIndex++;
    console.log("playIndex = "+playIndex);
    audio.src = listUrl[playIndex];
    console.log("url = "+audio.src);
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/song/detail',
        data:{
            ids:playList[playIndex].id
        },
        success:function(data){
            console.log(data);
            $('#name img').attr('src',data.songs[0].al.picUrl);
        }
    });
    $('#songName').html(playList[playIndex].name);
    songId = playList[playIndex].id;
    $('#artistName').html(playList[playIndex].artists[0].name);
    $('#personalFm img').attr('src',playList[playIndex].al.picUrl);
    $('#personalFm h3').html(playList[playIndex].name);
    $('#personalFm p').html(playList[playIndex].ar[0].name);
    lyricChange();
    audio.load();
   } else {
        // console.log(playIndex);
        // audio.src = listUrl[playIndex];
   }
}, 1000);
console.log($('#volume2').css('left'));
$('#progress').on('click',function(event){
    var position = event.offsetX/800 ;
    console.log(event.offsetX);
    audio.currentTime = position*audio.duration;
});
$('#volume').on('click',function(){
    var x = $('#volume')[0].offsetLeft;
    $('#volume2').css('left', x - 69 +'px');
    $('#volume2').fadeToggle('fast','linear');
});
$('#volume2').on('click',function(event){
    var sound = event.offsetX/50;
    console.log(event.offsetX); 
    audio.volume = sound;
    $('#volume3').css('width',parseInt(sound*100) + '%');
});

//登录功能
$('#signInBtn').on('click',function(){
    var phone = $('#inputUsername').val();
    var password = $('#inputPassword').val();
    // $('#')
    $.ajax({
        type:'post',
        url:'http://simonwann.vipgz1.idcfengye.com/login/cellphone',
        data:{
            phone:phone,
            password:password
        },
        header:{
            withCredentials: true
        },
        success:function(data){
            if(data.code === 200){
                console.log('登陆成功');
                console.log(data);
                account = data.account;
                profile = data.profile;
                $.ajax({
                    url:'http://simonwann.vipgz1.idcfengye.com/likelist',
                    data:{
                        uid:data.account.id
                    },
                    success:function(data){
                        console.log(data);
                        likeMusic = data.ids;
                    }
                })
                $('#signInForm').css('display','none');
                $('#username img').attr({
                    src:profile.avatarUrl
                });
                $('#nickname').html(profile.nickname);
                $('#signature').html(profile.signature);
                $('#username').fadeToggle('fast');
                $('#signBtn1').fadeToggle('fast');
                $('#songList').fadeToggle('fast');

                $.ajax({
                    url:'http://simonwann.vipgz1.idcfengye.com/user/playlist',
                    data:{
                        uid:account.id
                    },
                    success:function(data){
                        console.log(data);
                        collectList = data.playlist.concat();
                        
                        var html5 = template('tp5',{
                            songList:collectList
                        });
                        $('#songList div').append(html5);
                    }
                });
            }
            
        },
        error:function(data){
            console.log(data);
        }
    });

    

});
var result = {};

$('#submit').on('click',function(){
    $('#personalFm').fadeOut('fast');
    playList.splice(0,playList.length);
    ids.splice(0,ids.length);
    listUrl.splice(0,listUrl.length);
    var i =0;
    $('#searchVal tr').remove();
    var keywords = $('#keywords').val();
    console.log(keywords);
    var tp1 = $('#tp1')[0];
    var date = new Date();
    date = date.getTime();
    $.ajax({
        type:'get',
        url:'http://simonwann.vipgz1.idcfengye.com/search',
        data:{
            keywords:keywords,
            limit:20,
            timestamp:date
        },
        success:function(data){
            isFm = 0;
            console.log(data);
            result = data.result;
            playList.songs = [];
            for(var index = 0;index<result.songs.length;index++){
                // result.songs[index].duration = parseInt(result.songs[index].duration/1000/60) + ':' + parseInt(result.songs[index].duration/1000%60);
                // // console.log(result.songs[index]
                // result.songs[index].ar = result.songs[index].artists.concat();
                //获取歌曲封面
                $.ajax({
                    url:'http://simonwann.vipgz1.idcfengye.com/song/detail',
                    data:{
                        ids:result.songs[index].id
                    },
                    success:function(data){
                        i++;
                        playList.push(data.songs[0]);
                        if(i > result.songs.length - 1){
                            var trResult = template('tp1',{
                                song:playList,   
                            })
                            $('#searchVal tbody').append(trResult);
                        }
                    }
                });
            }
            
        },
        error:function(data){
            console.log(data)
        }
    })
    
});
$('#searchVal').on('click','tr td',function(){
    playIndex = $(this).parent().index() - 1;
    ids.splice(0,ids.length);
    listUrl.splice(0,listUrl.length);
    for (var i=0;i<playList.length;i++){
        ids.push(playList[i].id);
    }
    urlGet(function(){
        
        $('#commentArea').fadeOut('fast');
        $('#songList2').fadeOut('fast');
        console.log(playIndex);
        $('#songName').html(playList[playIndex].name);
        $('#artistName').html(playList[playIndex].ar[0].name);
        $('#name img').attr('src',playList[playIndex].al.picUrl);
        $('#personalFm img').attr('src',playList[playIndex].al.picUrl);
        $('#personalFm h3').html(playList[playIndex].name);
        $('#personalFm p').html(playList[playIndex].ar[0].name);
        audio.src = listUrl[playIndex];
        audio.load();
                
    });
    
});
$('#searchA a').on('click',function(){
    $('#search').fadeToggle('fast');
    $('#commentArea').fadeOut('fast');
    $('#songList2').fadeOut('fast');
    $('#personalFm').fadeOut('fast');
});

$('#signBtn1').on('click',function(){
    $('#signInForm').fadeToggle('fast');
    
});
$('#backWard').on('click',function(){
    if( playIndex<1 ){
        playIndex = playList.length;
    }
    playIndex--;
    $('#songName').html(playList[playIndex].name);
    $('#artistName').html(playList[playIndex].ar[0].name);
    audio.src = listUrl[playIndex];
    $('#favoriteH').css('color','#333');
    $('#name img').attr('src',playList[playIndex].al.picUrl);
    $('#personalFm img').attr('src',playList[playIndex].al.picUrl);
    $('#personalFm h3').html(playList[playIndex].name);
    $('#personalFm p').html(playList[playIndex].ar[0].name);
    lyricChange()
    audio.load();
});
$('#forward').on('click',function(){
    if( playIndex > playList.length - 2 ){
        playIndex = -1;
    }
    playIndex++;
    audio.src = listUrl[playIndex];
    $('#songName').html(playList[playIndex].name);
    $('#artistName').html(playList[playIndex].ar[0].name);
    $('#favoriteH').css('color','#333');
    $('#name img').attr('src',playList[playIndex].al.picUrl);
    $('#personalFm img').attr('src',playList[playIndex].al.picUrl);
    $('#personalFm h3').html(playList[playIndex].name);
    $('#personalFm p').html(playList[playIndex].ar[0].name);
    lyricChange()
    audio.load();
});
$('#favoriteH').on('click',function(){
    var songId = playList[currentIndex].id
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/like',
        data:{
            id:songId,
            like:true
        },
        success:function(data){
            console.log(data);
            $('#favoriteH').css('color','#d17673')
        }
    });
});
$('#commm').on('click',function(){
    $('#personalFm').fadeOut('fast');
    songId = playList[playIndex].id;
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/comment/music',
        data:{
            id:songId
        },
        success:function( data ){
            $('#hotComments').empty();
            $('#usualComments').empty();
            $('#commentArea').fadeIn('fast');
            $('#search').fadeOut('fast');
            $('#songList2').fadeOut('fast');
            console.log(data);
            currentComments = data;
            for(var i=0;i<currentComments.hotComments.length;i++)
            $.ajax({
               url:'http://simonwann.vipgz1.idcfengye.com/user/detail' ,
               data:{
                uid:currentComments.hotComments[i].commentId
               },
               success:function(data){
                   console.log(data);
                // currentComments.hotComments[i].commentId = data
               }
            });
            var html2 = template('tp2',{
                hotComments:currentComments.hotComments
            });
            $('#hotComments').append(html2);
            var html3 = template('tp3',{
                usualComments:currentComments.comments
            })
            $('#usualComments').append(html3);
        }
    });
});
$('#songList div').on('click','a',function(){
    $('#personalFm').fadeOut('fast');
    $('#songListName tbody').empty();
    $('#songList div a').removeClass('active');
    $(this).toggleClass('active');
    $('#songList2').fadeIn('fast');
    $('#commentArea').fadeOut('fast');
    $('#search').fadeOut('fast');
    console.log($(this).index());
    songListIndex = $(this).index();
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/playlist/detail',
        data:{
            id:collectList[songListIndex].id
        },
        success:function(data){
            isFm = 0;
            console.log(data);
            playList.splice(0,playList.length);
            listUrl.splice(0,playlistId.length);
            playlistId.splice(0,playlistId.length);
            for(var i = 0;i <data.privileges.length ;i++){
                playlistId.push(data.privileges[i].id);  
            }
            
            $.ajax({
                url:'http://simonwann.vipgz1.idcfengye.com/song/detail',
                data:{
                    ids:playlistId.toString()
                },
                success:function(data){
                    console.log(data);
                    playList = data.songs.concat();
                    var html4 = template('tp4',{
                        song:playList
                    });
                    $('#songListName tbody').append(html4);
                    for(var i = 0;i<playlistId.length;i++){
                        $.ajax({
                            url:'http://simonwann.vipgz1.idcfengye.com/song/url',
                            data:{
                                id:playlistId[i]
                            },
                            success:function(data){
                                playList.url = [];
                                listUrl.push(data.data[0].url);   
                                playList.url.push(data.data[0].url);
                                
                            },
                            error:function(data){
                                console.log(data);
                            }
                        });
                    }

                }
            }); 
            
        }
    });
});
$('#songList2').on('click','tr td',function(){
    console.log(this);
    playIndex = $(this).parent().index() - 1;
    console.log(playIndex);
    console.log(listUrl);
    audio.src = listUrl[playIndex];
    audio.load();
    $('#name img').attr('src',playList[playIndex].al.picUrl);
    $('#name #songName').html(playList[playIndex].name);
    $('#name #artistName').html(playList[playIndex].ar[0].name);
    $('#personalFm img').attr('src',playList[playIndex].al.picUrl);
    $('#personalFm h3').html(playList[playIndex].name);
    $('#personalFm p').html(playList[playIndex].ar[0].name);
});
$('#dailyList a').on('click',function(){
    $('#personalFm').fadeOut('fast');
    console.log('click');
    $('#songListName tbody').empty();
    playList.splice(0,playList.length);
    listUrl.splice(0,playlistId.length);
    playlistId.splice(0,playlistId.length);
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/recommend/songs',
        success:function(data){
            isFm = 0;
            $('#songList2').fadeIn('fast');
            $('#commentArea').fadeOut('fast');
            $('#search').fadeOut('fast');
            console.log(data);
            playList = data.data.dailySongs.concat();
            for(var i=0;i<playList.length;i++){
                playlistId.push(playList[i].id);
            }
            var html6 = template('tp6',{
                song:playList
            });
            $('#songListName tbody').append(html6);
            for(var i = 0;i<playlistId.length;i++){
                $.ajax({
                    url:'http://simonwann.vipgz1.idcfengye.com/song/url',
                    data:{
                        id:playlistId[i]
                    },
                    success:function(data){
                        playList.url = [];
                        listUrl.push(data.data[0].url);   
                        playList.url.push(data.data[0].url);
                        
                    },
                    error:function(data){
                        console.log(data);
                    }
                });
            }
        }
    });
});
$('#topPodcasts a').on('click',function(){
    alert('正在开发～');
});
$('#madeForU a').on('click',function(){
    
    $('#personalFm').fadeIn('fast');
    isFm = 1;
    personalFm();
    audio.load();
    
});
$('#comment #lrc').on('click',function(){
    
    $('#personalFm img').attr('src',playList[playIndex].al.picUrl);
    $('#personalFm h3').html(playList[playIndex].name);
    $('#personalFm p').html(playList[playIndex].ar[0].name);
    $('#commentArea').fadeOut('fast');
    $('#songList2').fadeOut('fast');
    $('#search').fadeOut('fast');
    $('#personalFm').fadeIn('fast');
    
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/lyric',
        data:{
            id:playList[playIndex].id
        },
        success:function(data){
            console.log(data);
            var timeExp = /\[[0-9]{2,}:[0-9]{2,}.[0-9]{2,}\]+/g;
            console.log(timeExp.exec(data.lrc.lyric));
            lyric[0] = data.lrc.lyric.replace(timeExp,'<br />');
            $('#lyric').html(lyric[0]);
        }
    });
    
});






function personalFm(){
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/personal_fm',
        success:function(data){
            $('#commentArea,#songList2,#search').fadeOut('fast');
            console.log(data);
            playList.splice(0,playList.length);
            listUrl.splice(0,listUrl.length);
            ids.splice(0,listUrl.length);
            playList = data.data.concat()
            for(var i=0;i<playList.length;i++){
                
                playList[i].al = JSON.parse(JSON.stringify(data.data[i].album));
                playList[i].ar = JSON.parse(JSON.stringify(data.data[i].artists));
                playList[i].id = data.data[i].privilege.id;
                }
            for (var i=0;i<playList.length;i++){
                ids.push(playList[i].id);
            }    
            console.log(ids.toString());
            
            $.ajax({
                url:'http://simonwann.vipgz1.idcfengye.com/song/url',
                data:{
                    id:ids.toString()
                },
                success:function(data){
                    console.log(data);
                    for (var i=0;i<data.data.length;i++){
                        listUrl.push(data.data[i].url);
                    }
                    playIndex = 1;
                    $('#songName').html(playList[playIndex].name);
                    $('#artistName').html(playList[playIndex].ar[0].name);
                    audio.src = listUrl[playIndex];
                    $('#favoriteH').css('color','#333');
                    $('#name img').attr('src',playList[playIndex].al.picUrl);
                    $('#personalFm img').attr('src',playList[playIndex].al.picUrl);
                    $('#personalFm h3').html(playList[playIndex].name);
                    $('#personalFm p').html(playList[playIndex].ar[0].name);
                    $.ajax({
                        url:'http://simonwann.vipgz1.idcfengye.com/lyric',
                        data:{
                            id:playList[playIndex].id
                        },
                        success:function(data){
                            console.log(data);
                            var timeExp = /\[[0-9]{2,}:[0-9]{2,}.[0-9]{2,}\]+/g;
                            console.log(timeExp.exec(data.lrc.lyric));
                            lyric[0] = data.lrc.lyric.replace(timeExp,'<br />');
                            $('#lyric').html(lyric[0]);
                        }
                    });
                    

                }
            })
            
        }
    })
};

function lyricChange(){
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/lyric',
        data:{
            id:playList[playIndex].id
        },
        success:function(data){
            console.log(data);
            var timeExp = /\[[0-9]{2,}:[0-9]{2,}.[0-9]{2,}\]+/g;
            console.log(timeExp.exec(data.lrc.lyric));
            lyric[0] = data.lrc.lyric.replace(timeExp,'<br />');
            $('#lyric').html(lyric[0]);
        }
    });
}

function urlGet( callback ){
    $.ajax({
        url:'http://simonwann.vipgz1.idcfengye.com/song/url',
        data:{
            id:ids.toString()
        },
        success:function(data){
            // console.log(data);
            for (var i=0;i<data.data.length;i++){
                listUrl.push(data.data[i].url);
            }
            console.log(data);
            callback && callback(); 
        },
        error:function(data){
            console.log(data);
        }
    })
}

function idToUrl(objx,objy){
    
    var unit1 = [[],[],[],[],[],[],[],[],[],[]];
    for(var j = 0 ; j < 10 ; j++){
        for(var i=0 ;i<objx.length;i++){
            if( objx[i]%10 === j ){
                unit1[j].push(objx[i]);
            }
            
        }
        for(var i = 0 ; i<objy.length ; i++){
            if( objy[i]%10 === j ){
                unit1[j].push(objy[i]);
            }
        }
    }
}