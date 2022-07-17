const { firestore } = require('../config/firebase-config');
const { Web3Storage, File } = require('web3.storage')
const fishMetaCol = firestore.collection('fish-metadata');
const encode = require("node-base64-image").encode;

// DUMMY ADDRESS FOR TESTING
const owner = "0x398b5A38fe9a5747fE8139eEDae558575cC68381";

async function encodeImage(url) {
    image = await encode(url);
    return image;
}

const getMetadataDocID = async () => {
    let id;
    await fishMetaCol.where('owner', '==', owner).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            id = `${doc.id}`;
        });
    })
    
    return id;
}
   
const getMetadata = async () => {
    
    let metadataTemp;

    await fishMetaCol.where('owner', '==', owner).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            metadataTemp = doc.data();
        });
    })

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
}

const updateMetadata = async (_, res) => {
    try {
        const id = await getMetadataDocID()
        const cid = await createImageCID();

        await fishMetaCol.doc(id).update({image: cid});

        res.status(200).send(`Metadata updated!`);

    } catch (error) {
        res.status(500).send(error);
    }
}

const createImageCID = async () => {
    const w3s = new Web3Storage({token: process.env.WEB3_STORAGE_TOKEN});

    const getData = await getMetadata();
    let imageURL = getData.image_alt;
    let imageName = getData.name;
    console.log(getData)

    const ImageB64 = await encodeImage(imageURL);
    const file = (new File([ImageB64], imageName));
    const cid =  await w3s.put([file]);

    return `https://ipfs.io/ipfs/${cid}`;
}

const uploadImage = async (_, res) => {
    try {
        const cid = await createImageCID();

        res.status(200).send(`Image successfully update: ${cid}`);

    } catch (error) {
        res.status(500).send(error);
    }
}

const test = async (req, res) => {
    res.send("THIS WORKS");
};

module.exports = {test, uploadImage, updateMetadata}