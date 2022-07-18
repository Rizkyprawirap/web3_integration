const { firestore } = require('../config/firebase-config');
const { Web3Storage, File } = require('web3.storage')
const fishMetaCol = firestore.collection('fish-metadata');
const encode = require("node-base64-image").encode;

// DUMMY ADDRESS FOR TESTING
// const ownerAddress = "0x398b5A38fe9a5747fE8139eEDae558575cC68381";

const getMetadata = async (ownerAddress) => {
    
    let metadataTemp;

    await fishMetaCol.where('owner', '==', ownerAddress).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            metadataTemp = doc.data();
        });
    });

    const metaObj = {
        owner: metadataTemp.owner,
        image: metadataTemp.image,
        image_alt: metadataTemp.image_alt,
        name: metadataTemp.name,
        description: metadataTemp.description,
        external_url: metadataTemp.external_url,
        caught_date: metadataTemp.caught_date,
        attributes: metadataTemp.attributes,
    };

    return metaObj;
};

const uploadImage = async (req, res) => {
    let ownerAddress = req.body.owner
    try {
        // console.log(ownerAddress);
        const cid = await createImageCID(ownerAddress);
        res.status(200).send(`Image successfully update: ${cid}`);
    } catch (error) {
        res.status(500).send(error);
    };
};

const createImageCID = async (ownerAddress) => {
    const w3s = new Web3Storage({token: process.env.WEB3_STORAGE_TOKEN});

    const getData = await getMetadata(ownerAddress);
    let imageURL = getData.image_alt;
    let imageName = getData.name;
    // console.log(getData)

    const ImageB64 = await encodeImage(imageURL);
    const file = (new File([ImageB64], imageName));
    const cid =  await w3s.put([file]);

    return `https://ipfs.io/ipfs/${cid}`;
};

async function encodeImage(url) {
    image = await encode(url);
    return image;
};

const getMetadataDocID = async (ownerAddress) => {
    let id;
    await fishMetaCol.where('owner', '==', ownerAddress).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            id = `${doc.id}`;
        });
    });
    console.log(id);
    return id;
};

const updateMetadata = async (req, res) => {
    let ownerAddress = req.body.owner
    try {
        const id = await getMetadataDocID(ownerAddress);
        const cid = await createImageCID(ownerAddress);
        console.log(ownerAddress);
        await fishMetaCol.doc(id).update({image: cid});
        // res.status(200).send(`Image successfully update: ${ownerAddress}`);
        res.status(200).send(`Metadata updated!`);

    } catch (error) {
        res.status(500).send(error);
    }
}

const test = async (req, res) => {
    res.send("Hello World!");
};

module.exports = {test, uploadImage, updateMetadata}