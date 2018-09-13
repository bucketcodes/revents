import moment from 'moment'
import cuid from 'cuid'
import { toastr } from 'react-redux-toastr'
import { asyncActionStart, asyncActionFinish, asyncActionERROR } from '../async/ayncActions'

export const updateProfile = (user) => 
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const {isLoaded, isEmpty, ...updatedUser} = user
        if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
            updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
        }

        try{

            await firebase.updateProfile(updatedUser);
            toastr.success('Success!', 'Profile updated');

        }catch(error){
            console.log(error);
            toastr.error('Error...', 'Something went wrong...');
        }
    }


export const uploadProfileImage = (file, fileName) => 
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const imageName = cuid();
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;
        const options = {
            name: imageName
        }

        try{
            dispatch(asyncActionStart());
            //upload the file to firebase storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options);
            
            //get url of the image
            let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
            
            //Get userdoc
            let userDoc = await firestore.get(`users/${user.uid}`);
            
            //check if user has a photo, if not update profile with new image
            if (!userDoc.data().photoURL){
                await firebase.updateProfile({
                    photoURL: downloadURL
                });
                await user.updateProfile({
                    photoURL: downloadURL
                });
            }
            
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
                },{
                name: imageName,
                url: downloadURL
                }
            );

            dispatch(asyncActionFinish());

        }catch(error){
            console.log(error);
            throw new Error('Problem uploading photo');
            dispatch(asyncActionERROR);
        }
    }

export const deletePhoto = (photo) => {
    return async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        try{
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos', doc: photo.id}]
            })
        }catch(error){
            console.log(error);
            throw new Error('Problem deleting photo');
        }
    }
}

export const setMainPhoto = (photo) => {
    return async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        try{
            return await firebase.updateProfile({
                photoURL: photo.url
            })
        }catch(error){
            console.log(error);
            throw new Error('Problem setting photo')
        }
    }
}