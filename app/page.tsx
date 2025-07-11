"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {

  
  const { data:session } = useSession();
  return ( 
    <div className="place-content-center flex flex-col items-center">
      <Navbar/>
      <div className="grid grid-rows-2">
        <div className="">
          <div className="border-2 border-gray-800">
            <HeaderT/>
            <InputAdd/>
          </div>
          <div className="border-2 border-gray-800">
            <QuotesLoad/>
          </div>
        </div>
        <div>
            <Filter/>
            <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus ea, fuga esse voluptatibus, quae deserunt nobis et placeat quis, fugiat repellat provident natus reiciendis quos beatae rerum! Quibusdam, numquam voluptate.</div>
        </div>
      </div>
      
      
      
    </div>
  );
}<img src="" alt="" />

function Navbar(){
  const {data: session} = useSession();

  return (<div className="w-screen px-50 flex justify-between h-15 items-center border-b-4 border-gray-700">
    <div className=" text-4xl font-bold">Ki-Do</div>
    <div className="flex items-center justify-center">
      {session ? (
          <div className="flex gap-3">
            
            
            {session.user?.image && (
              <img 
                src={session.user?.image} 
                alt="User profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            )}

            <p>{session.user?.name || session.user?.email}</p>
            <button className="p-2 text-lg bg-red-500 text-white" onClick={() => signOut()}>Sign out</button>
          </div>
        ) : (
          <>
            <button className="p-2 text-lg bg-black text-white" onClick={() => signIn()}>Sign in</button>
          </>
        )}
      
    </div>
  </div>)
}

function QuotesLoad(){
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try{
        const res = await fetch("https://api.animechan.io/v1/quotes/random")
        const data = await res.json()
        setQuote(`"${data.data.content}" — ${data.data.character.name}`)
      } catch(e) {
        console.error("Error fetching quote:", e);
        setQuote("We'll Work on This  — Team")
      };
    }

    fetchQuote();
  }, [])

  return <div className="flex place-content-center">
    <p>{quote}</p>
  </div>
}

function HeaderT(){
  const date = new Date();

  return <div className="flex justify-between px-100">
    <p>{date.getMonth()} - {date.getDate()}</p>
    <p>Todo</p>
    <p>{date.getHours()} : {date.getMinutes()}</p>
  </div>
}

function InputAdd() {
  return(
    <div className="flex">
      <input type="text" placeholder="enter you task here" className="outline-black-900"/>
      <button>+</button>
    </div>
  )
}

function Filter() {
  return(
    <div className="flex">
      <div className="flex">
        <label>filter</label>
        <select name="" id="smtg" >
          <option  value="all">all</option>
          <option  value="pending">pending</option>
          <option  value="complete">complete</option>
          </select>
      </div>
      <div><label>sort</label>
        <select name="" id="smtg">
          <option  value="newest first">newest first</option>
          <option  value="oldest first">oldest first</option>
          <option  value="alphabetically">alphabetically</option>
        </select>

      </div>
    </div>
  )
}


