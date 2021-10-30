let password, passwordHash, passwordSeed, service, serviceHash, color, superSecurePassword;

const characters = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Copy password to clipboard
 *
 */
function copyToClipboard() {
    passwordResult = document.getElementById("password-result");
    if(passwordResult.value == '') return;
    passwordResult.select();
    navigator.clipboard.writeText(passwordResult.value);
}

/**
 * Generate password on password input type
 *
 */
function passwordChange() {
    password = document.getElementById("password").value;
    if(password == '') return reset();
    passwordGenerator();
}

/**
 * Generate password on service input type
 *
 */
function serviceChange() {
    service = document.getElementById("service").value;
    if(service == '') return reset();
    passwordGenerator();
}

/**
 * Change secure text color
 *
 * @param {*} string
 */
function colorChange(hash) {
    let secureText = document.getElementById("secure");
    let secureColor = hash.hex();
    secureText.style.color = secureColor;
}

/**
 * Generate new password
 *
 * @return {*} 
 */
async function passwordGenerator() {
    passwordHash = await createHash(password);
    serviceHash = await createHash(service);
    let superSecurePasswordHash = await createHash(passwordHash + serviceHash);
    let passwordCreated = createPassword(superSecurePasswordHash);
    document.getElementById("password-result").value = passwordCreated;
    colorChange(superSecurePasswordHash);
}

/**
 * Create password from hash
 *
 * @param {*} hash
 * @return {*} 
 */
function createPassword(hash) {
    const seed = random.create(hash);
    let result = '';
    for(let i = 0; i < 12; i++) {
        result += characters[seed(characters.length)];
    }
    return result;
}

/**
 * Create new hash
 *
 * @param {*} str
 * @return {*} 
 */
async function createHash(str) {
    const buf = await crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
}

/**
 * Reset values
 *
 */
function reset() {
    if(password !== '' || service !== '') return;
    document.getElementById("password-result").value = '';
    document.getElementById("secure").style.color = '#ffffff';
}

/**
 * Create hex color
 */
String.prototype.hex = function() {
	var self = this, hash = 0, color = '#';
	for(var i = 0; i < self.length; i++) { hash = self.charCodeAt(i) + ((hash << 5) - hash); }
	for(var i = 0; i < 3; i++) { var value = (hash >> (i * 8)) & 0xFF; color += ('00' + value.toString(16)).substr(-2); }
	return color;
}