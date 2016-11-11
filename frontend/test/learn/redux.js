
const initState = "";
const actions = ["a","b","c","d","e"];
const newState = actions.reduce(
//	function(previous, current, index, array){
//		return previous.concat(current);
//	}
	(pre,current,index,array)=>pre.concat(current)
	,initState
);


//console.log(newState);

let counters = { 
	    faves: 0, 
	    forward: 20, 
	} ;
	// this creates a brand new copy overwriting just that key 
	counters = {...counters, faves: counters.faves + 1} ;

console.log(counters.faves);