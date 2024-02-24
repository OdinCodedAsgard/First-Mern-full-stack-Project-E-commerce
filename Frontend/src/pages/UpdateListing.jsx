import React, { useEffect } from 'react'
import { useState } from 'react'
import {useSelector } from 'react-redux';
import {getDownloadURL, getStorage,ref,uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { useNavigate ,useParams} from 'react-router';

export default function UpdateListing() {
const {currentUser}= useSelector(state => state.user)
const [file,setFile]= useState([]);
const[imageError,setImageError] = useState(null)
const[imageSuccess,setImageSuccess]=useState(false)
const[uploading,setUploading]=useState(false)
const[formError, setFormError]=useState(false)
const [formload, setFormLoad]=useState(false)
const [imgs,setimgs]=useState([]);
const [formData,setFormData]=useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:0,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false
})
const navigate = useNavigate();
const params = useParams();
useEffect(()=>{
const fetchListing = async ()=>{
 const listingId = params.listingid

const res = await fetch(`http://localhost:3100/api/getListing/${listingId}`,{
    method:"GET",
    credentials:"include"
})
const data =await res.json()
if(data.success ===false){
    console.log(data.message);
    return;
}
setFormData(data.listing)
}
fetchListing();
},[])

const handleImageUpload = (e)=>{
    if(file.length > 0 && (file.length + formData.imageUrls.length)<7){
        setUploading(true);
        const promises = [];
        for (let i=0;i<file.length;i++){
            promises.push(storeImage(file[i]));
        }

        Promise.all(promises).then((urls)=>{
            setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
            setImageError(false);
        }).catch((err)=>{
            setImageError(err.message);
            
        })
        setUploading(false);
        
        setImageSuccess("uploaded Successfully");
        console.log("success");
        
    }else{
        setImageError("please upload 6 images only");
        setUploading(false);
    }
   setTimeout(()=>{
    setImageSuccess(false);
   },5000) 
};
const storeImage =async(file)=>{
    return new Promise((resolve,reject)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) *100
                console.log("Upload is : "+progress+"%")
            },
            (error)=>{
                reject(error);

            },
            ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then((downlaodURL)=>{
                    resolve(downlaodURL);
                });
            }
        )
    })
};    

const handleImageDeletion = (index)=>{
    setFormData({...formData ,imageUrls: formData.imageUrls.filter((_,i)=> i !== index)})
}
const handleChange = (e)=>{
    if(e.target.id ==='sale' || e.target.id ==='rent'){
        setFormData({
            ...formData,
            type:e.target.id
        })
    }

    if(e.target.id ==='parking' || e.target.id ==='furnished' || e.target.id ==='offer'){
        setFormData({
            ...formData,
            [e.target.id] : e.target.checked
        })
    }
    if(e.target.type==='number'||e.target.type  === 'text'){
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
}
}
const handleSubmitForm = async(e)=>{
    e.preventDefault();
    try{
        if((formData.imageUrls).length < 1) return setFormError("upload minimum of 1 Image at least");
        if(+formData.regularPrice < +formData.discountPrice) return setFormError("Discount price should be less than Regular Price");
        setFormLoad(true);
        setFormError(false);
        const SendData = await fetch(`http://localhost:3100/api/updateListing/${params.listingid}`,{
            method:'POST',
            credentials:'include',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                ...formData,
                userReference: currentUser._id
            })
        });
        const responseData = await SendData.json();
        setFormLoad(false);
        if(responseData.success===false){
            setFormError(responseData.message);
        }
        console.log("done with form");
        navigate(`/listings/${responseData.updatedListing._id}`);
        setFormData(responseData.updatedListing);

    }catch(error){
        setFormError(error.message);
        setFormLoad(false);
    }
}
  return (
    <main  className="p-5 mx-auto">
        <h1 className='text-4xl my-10 font-serif font-semibold text-center text-head'>Edit a pre-exiting House Listing </h1>
        <form onSubmit={handleSubmitForm} className='flex mx-10 flex-col sm:flex-row'>
            <div className='flex flex-col gap-4 flex-1'>
                <input value={formData.name} onChange={handleChange} type="text" placeholder='Name' className='border p-3 rounded-lg' id="name" maxLength={50} required/>
                <input value={formData.description} onChange={handleChange} type="text" placeholder='Description' className='border p-3 rounded-lg' id="description" required/>
                <input value={formData.address} onChange={handleChange} type="text" placeholder='Address' className='border p-3 rounded-lg' id="address" required/>
                <div className='flex gap-8 flex-wrap'>
                    <div className='flex gap-2'>
                        <input checked={formData.type === "sale" } onChange={handleChange} type="checkbox" id="sale" className='w-10'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.type ==="rent"} onChange={handleChange} type="checkbox" id="rent" className='w-10'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.parking} onChange={handleChange} type="checkbox" id="parking" className='w-10'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.furnished} onChange={handleChange} type="checkbox" id="furnished" className='w-10'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.offer} onChange={handleChange} type="checkbox" id="offer" className='w-10'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-9'>
                    <div className='flex items-center gap-2 mt-2'>
                        <input value={formData.bedrooms} onChange={handleChange} className='p-3 w-20 h-10 border rounded-lg border-bermuda' type="number" id='bedrooms' min='1' required />
                        <span>No of Bedrooms</span>
                    </div>
                    <div className='flex items-center gap-2 mt-2'>
                        <input value={formData.bathrooms} onChange={handleChange} className='p-3 w-20 h-10 border rounded-lg border-bermuda' type="number" id='bathrooms' min='1' required />
                        <span>No of Bathrooms</span>
                    </div>
                    <div className='flex items-center gap-2 mt-2'>
                        <input value={formData.regularPrice} onChange={handleChange} className='p-3 w-20 h-10 border rounded-lg border-bermuda' type="number" id='regularPrice' required />
                        <div className='flex flex-col items-center'>
                        <span>Regular Price </span>
                        <p className='text-xs'>($ / Month)</p>
                        </div>
                    </div>
                    {formData.offer &&
                    <div className='flex items-center gap-2 mt-2'>
                        <input value={formData.discountPrice} onChange={handleChange} className='p-3 w-20 h-10 border rounded-lg border-bermuda' type="number" id='discountPrice' required />
                       <div className='flex flex-col items-center'>
                        <span>Discounted Price </span>
                        <p className='text-xs'>($ / Month)</p>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <div className='flex mx-9 flex-col flex-1 gap-3'>
                <p className='font-bold'>Images:<span className='font-semibold text-tahiti ml-1'>The first image will be the cover(max 6)</span></p>
                <div className='flex flex-col gap-3'>
                    <input onChange={(e)=>{setFile(e.target.files)}} className='p-4 border my-auto border-metal rounded-lg h-15 w-45'type="file" id='images' accept='image/*' multiple/>
                    <button type='button' onClick={handleImageUpload} className='p-1 w-40 h-16 mt-2 font-semibold text-black uppercase bg-green rounded-lg border border-green hover:drop-shadow-xl'> {uploading ? "Uploading...":"upload"} </button>
                </div>
                {((formData.imageUrls).length) > 0 && formData.imageUrls.map((url,index)=>(
                    <div key={url} className='flex justify-between p-3 border rounded-lg border-head items-center'>
                    <img src={url} alt='property image' className='h-32 w-32 object-cover rounded-lg shadow-md' />
                    <button type="button" onClick={()=>handleImageDeletion(index)} className='bg-midnight font-semibold p-2 w-24 h-16 text-white rounded-lg '>Remove Image</button>
                    </div>
                 )) }
                
            <button disabled={formload || uploading} className='p-2 bg-metal w-96 text-white rounded-lg uppercase hover:opcaity-90 disabled:opacity-50'>{formload?"creating..." : "Update Listing"}</button>
            <p className='text-head font-extrabold ' >{formError && formError}</p>
            <p className='text-head font-extrabold'>{imageError && imageError}</p>
            <p className='text-head font-extrabold'>{imageSuccess && imageSuccess}</p>
            </div>
        </form>
    </main>
  )
}
