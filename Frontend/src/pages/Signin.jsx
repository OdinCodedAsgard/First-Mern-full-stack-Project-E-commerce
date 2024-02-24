import React ,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux';
import { SignInStart,SignInSuccess,SignInFail } from '../../redux/user/userSlice';
import OAuth from '../components/oAuth';

export default function SignIn() {
  const dispatch = useDispatch();
  const[formData,setformData] = useState({});
  const {loading,error} =useSelector((state)=>state.user);
  const navigate = useNavigate();
  const handleChange =(e)=>{
    setformData({...formData,[e.target.id]: e.target.value });
    dispatch(SignInStart());
  };
  const handleSubmit =async (e)=>{
    e.preventDefault();
    const serverResponse = await fetch('http://localhost:3100/api/signin',{
      method:'POST',
      mode : 'no-cors', 
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData)
    });
    const data = await serverResponse.json();
    if(data.success ===false){
      dispatch(SignInFail(data.message));
      return;
    }
    dispatch(SignInSuccess(data));
    navigate('/home');
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-sans font-semibold my-6'>SignIn</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
       <input type='text' placeholder='Email' className='border-y-2 hover: border-t-3 p-3 rounded-lg' id ='email'onChange={handleChange}/>
        <input type='password' placeholder='Password' className='border-y-2 hover:border-t-3 p-3 rounded-lg' id ='password'onChange={handleChange}/>
        <button disabled={loading} className='bg-metal text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Type In credentials': 'Sign In'}</button>
      <OAuth />
      </form>
      
      <div className='flex gap-2 mt-5'>
        <p>
         Dont Have an Account yet?
        </p>
        <Link to={"/sign-up"}>
          <span className='text-cyan'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-midnight font-bold mt-5'>{error}</p>}
    </div>
  )
}

