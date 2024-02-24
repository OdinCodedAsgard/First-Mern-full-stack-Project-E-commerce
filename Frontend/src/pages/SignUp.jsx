import React ,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/oAuth';


export default function SignUp() {
  const[formData,setformData] = useState({});
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();
  const handleChange =(e)=>{
    setformData({...formData,[e.target.id]: e.target.value });
    setLoading(false);
  };
  const handleSubmit =async (e)=>{
    e.preventDefault();
    const serverResponse = await fetch('http://localhost:3100/api/signup',{
      method:'POST', 
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData)
    });
    const data = await serverResponse.json();
    if(data.success ===false){
      setError(data.message);
      setLoading(false)
      return;
    }
    navigate('/sign-in');
    console.log(data);
  }
console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-sans font-semibold my-6'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' placeholder='Username' className='border-y-2 hover:border-t-3 p-3 rounded-lg' id ='username'onChange={handleChange}/>
        <input type='text' placeholder='Email' className='border-y-2 hover: border-t-3 p-3 rounded-lg' id ='email'onChange={handleChange}/>
        <input type='text' placeholder='Password' className='border-y-2 hover:border-t-3 p-3 rounded-lg' id ='password'onChange={handleChange}/>
        <button disabled={loading} className='bg-metal text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'waiting for credentials': 'SignUp'}</button>
      </form>
      <OAuth/>
      <div className='flex gap-2 mt-5'>
        <p>
          Have an Account?
        </p>
        <Link to={"/sign-in"}>
          <span className='text-cyan'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-midnight font-bold mt-5'>{error}</p>}
    </div>
  )
}
