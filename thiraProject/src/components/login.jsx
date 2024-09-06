import React from "react";

const Login = () => {
  return (
    <>
    <form>
      <header className='text-center font-semibold py-2 text-2xl'>Login</header>
      <div class='mb-4 flex'>
                <div class="block text-gray-700 text-sm font-semibold mb-2 w-[50%] text-center" >Sign in</div>
                <div class="block text-gray-700 text-sm font-semibold mb-2 w-[50%] text-center" >Sign up</div>
            </div>
            <div class="mb-4">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
            </div>
            <div class="mb-6">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password"/>
            </div>
            <div class="flex items-center justify-between">
                <button class="w-[100%]   bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Sign In
                </button>
            </div>
        </form>
        </>
  );
};

export default Login;
