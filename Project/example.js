function Hash(arr) {
    var _arr = arr.split("");
    var key = arr.charCodeAt(0)*"apple".charCodeAt(4);
    var result1 = new Array;
    var result2 = new Array;

    for(var i=0; i < arr.length; i++)
    {
        result1[i] = _arr[i].charCodeAt(0).toString(2);
        if( i%2 != 0 ) result1[i] = null;
        result2[i] = (String.fromCharCode(result1[i]));
    }
    console.log(result2);
    return result2;
    
}

Hash("dfads");