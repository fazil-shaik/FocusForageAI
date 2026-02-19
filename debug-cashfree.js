const { Cashfree, CFEnvironment } = require('cashfree-pg');

Cashfree.XClientId = 'TEST_ID';
Cashfree.XClientSecret = 'TEST_SECRET';
Cashfree.XEnvironment = CFEnvironment.SANDBOX;

const instance = new Cashfree();

console.log('Attempting to call PGCreateOrder on instance...');
try {
    // Calling with dummy data to see if it reads config
    instance.PGCreateOrder('2023-08-01', {}).catch(e => {
        console.log('Caught promise rejection:', e.message);
        if (e.response) console.log('Response status:', e.response.status);
    });
} catch (e) {
    console.log('Caught sync error:', e.message);
}
