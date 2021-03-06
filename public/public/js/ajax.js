ajax = function(options){
    var default1 = {
        type:'get',
        url: '',
        data:'',
        header:{'Content-Type':'application/x-www-form-urlencoded'},
        callback: function (){},
        error: function(){}
    }
    Object.assign(default1,options);
    var xhr = new XMLHttpRequest();
    var params = '';
    
    
    for (attr in default1.data){
        params += attr + '=' + options.data[attr] + '&';
    };
    params = params.slice(0,params.length - 1);
    if(default1.type === 'get'){
        xhr.open(default1.type,default1.url + '?' +params);
    }
    if(default1.type === 'post'){
        xhr.open(default1.type,default1.url);
        var contentType = default1.header['Content-Type'];
        xhr.setRequestHeader('Content-Type',contentType);
        if(contentType === 'application/json'){
            xhr.send(JSON.stringify(default1.data));

        }else{
            xhr.send(params);
        }
        
    } else {
        xhr.send();
    }
    
    xhr.onload = function(){
        var contentHType = xhr.getResponseHeader('Content-Type');
        if ( contentHType.includes('application/json') ){
            xhr.responseText = JSON.parse(xhr.responseText);
            console.log(typeof(xhr.responseText));
        }
        if(xhr.status === 200){
            default1.callback(xhr.responseText);
        } else {
            default1.error(xhr.responseText,xhr);
        }
        
        // console.log(xhr.responseText);
    }
}