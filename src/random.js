import variables from './variables.js'

function randomAmouranthLinks(){
    return variables.amoLinks[Math.floor(Math.random() * variables.amoLinks.length)];
}

export default {
    randomAmouranthLinks,
}