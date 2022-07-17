const { initializeApp, cert} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./web3-integration.json');

initializeApp({
    credential: cert(serviceAccount),
});

const firestore = getFirestore();

module.exports = {firestore}