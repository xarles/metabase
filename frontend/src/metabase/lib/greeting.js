const greetingPrefixes = [
    '嘿,',
    '感觉怎么样,',
    '你好,',
    '祝贺你,',
    '见到你真好,',
];

const subheadPrefixes = [
    '你想要知道什么?',
    '你有什么想法？',
    '你在探索什么？',
];


var Greeting = {
    simpleGreeting: function() {
        // TODO - this can result in an undefined thing
        const randomIndex = Math.floor(Math.random() * (greetingPrefixes.length - 1));
        return greetingPrefixes[randomIndex];
    },

	sayHello: function(personalization) {
        if(personalization) {
            var g = Greeting.simpleGreeting();
            if (g === 'How\'s it going,'){
                return g + ' ' + personalization + '?';    
            } else {
                return g + ' ' + personalization;
            }
            
        } else {
        	return Greeting.simpleGreeting();
        }
    },

    encourageCuriosity: function() {
        // TODO - this can result in an undefined thing
        const randomIndex = Math.floor(Math.random() * (subheadPrefixes.length - 1));

        return subheadPrefixes[randomIndex];
    }
};

export default Greeting;
