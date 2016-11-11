function testFor(){
	
	for(var c of "test"){
		console.log(c);
	}
	
}

function testSet(){
	var words = "AAAAAABCD";
	var set = new Set(words);
	for(var c of set){
		console.log(c);
	}
}

function testMap(){
	
	var map = {
		'name':'apple',
		'test':'do it'
	}
	
	var mapObject = new Map();

	
	for(var [key,value ] of map){
		console.log("key:"+key+"->"+"value:"+value);
	}
	
}

function echo(state){
	console.log(state.test);
}


//var mapStateToProps = (state, props) => {
//    return {
//        ...echo(state),
//        user: state.currentUser
//    }
//};
	



// ************************* run *********************************
//testMap();
//mapStateToProps(
//	{test:'test',currentUser:'apple'},{}
//);


