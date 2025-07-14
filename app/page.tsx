"use client";

import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// FILTERS
const FILTER_MAP = {
  All: () => true,
  Active: (todo) => !todo.completed,
  Completed: (todo) => todo.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState("All");
  const { data: session } = useSession();

  return (
    <div className="place-content-center flex flex-col items-center">
      <Navbar />
      <div className="grid grid-cols-3 mx-30">
        <div className="col-span-1">
          <div className="border-4 border-gray-700 mt-10 mr-10 ">
            <HeaderT />
            <InputAdd onAdd={() => setRefresh(r => r + 1)} />
          </div>
          <div className="border-4 border-gray-700 mt-10 mr-10 p-8">
            <QuotesLoad />
          </div>
        </div>
        <div className="border-4 border-gray-700 mt-10 col-span-2 pl-8 pt-4">
          <Filter filter={filter} setFilter={setFilter} />
          <div>
            <TodoList
              refresh={refresh}
              setRefresh={setRefresh}
              filter={filter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="w-screen px-50 flex justify-between h-15 items-center border-b-4 border-gray-700">
      <div className="text-4xl font-bold">Ki-Do</div>
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
            <button className="p-2 text-lg bg-red-500 text-white" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <button className="p-2 text-lg bg-black text-white" onClick={() => signIn()}>
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}

function QuotesLoad() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.animechan.io/v1/quotes/random");
        const data = await res.json();
        setQuote(`"${data.data.content}" — ${data.data.character.name}`);
      } catch (e) {
        console.error("Error fetching quote:", e);
        setQuote("We'll Work on This  — Team");
      }
    };
    fetchQuote();
  }, []);

  return (
    <div className="flex place-content-center text-gray-600">
      <p>{quote}</p>
    </div>
  );
}

function HeaderT() {
  const date = new Date();

  return (
    <div className="flex gap-20 items-center justify-center px-10 pt-5">
      <p>
        {date.getMonth()} / {date.getDate()}
      </p>
      <p className="text-xl font-bold">Todo</p>
      <p>
        {date.getHours()} : {date.getMinutes()}
      </p>
    </div>
  );
}

function InputAdd({ onAdd }) {
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(false);

  async function addInput() {
    if (!todo) return;
    setLoading(true);
    const res = await fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todo }),
    });
    setLoading(false);

    if (res.ok) {
      setTodo("");
      if (onAdd) onAdd();
    } else {
      console.log("not added");
      console.log(res);
    }
  }

  return (
    <div className="flex px-10 pt-5 justify-center pb-5 gap-7">
      <div className="border-3 border-gray-400 flex items-center pl-2">
        <input
          type="text"
          placeholder="enter your task here"
          className="outline-none"
          value={todo}
          onChange={e => setTodo(e.target.value)}
          disabled={loading}
          onKeyDown={e => {
            if (e.key === "Enter") addInput();
          }}
        />
      </div>
      <button onClick={addInput} className="bg-green-400 p-3 px-4" disabled={loading}>
        <PlusIcon />
      </button>
    </div>
  );
}

function Filter({ filter, setFilter }) {
  return (
    <div className="flex gap-2 mb-4">
      {FILTER_NAMES.map(name => (
        <button
          key={name}
          className={`px-3 py-1 border rounded ${
            filter === name ? "bg-blue-500 text-white" : "bg-white text-black"
          }`}
          onClick={() => setFilter(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function TodoList({ refresh, setRefresh, filter }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      const res = await fetch("/api/todo");
      if (res.status === 401) {
        setTodos([]);
      } else {
        const data = await res.json();
        setTodos(data);
      }
      setLoading(false);
    }
    fetchTodos();
  }, [refresh]);

  const filteredTodos = todos.filter(FILTER_MAP[filter]);

  if (loading) return <div>loading . . .</div>;
  if (filteredTodos.length === 0) return <div>No Todo's Found or not logged in</div>;

  return (
    <div>
      <h2>Your Todos</h2>
      <ul>
        {filteredTodos.map(todo => (
          <TodoComponent
            key={todo.id}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}
            onChange={() => setRefresh(r => r + 1)}
          />
        ))}
      </ul>
    </div>
  );
}

function TodoComponent({
  id,
  title,
  completed,
  onChange,
}) {
  const [done, setDone] = useState(completed);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [loading, setLoading] = useState(false);

  // Keep editValue in sync with title prop
  useEffect(() => {
    setEditValue(title);
  }, [title]);

  // Keep done in sync with completed prop
  useEffect(() => {
    setDone(completed);
  }, [completed]);

  async function deleteTodo() {
    setLoading(true);
    const res = await fetch(`/api/todo/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) onChange();
  }

  async function saveEdit() {
    setLoading(true);
    const res = await fetch(`/api/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editValue, completed: done }),
    });
    setLoading(false);
    if (res.ok) {
      setEditing(false);
      onChange();
    }
  }

  async function toggleCompleted() {
    setLoading(true);
    const res = await fetch(`/api/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editValue, completed: !done }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(!done);
      onChange();
    }
  }

  return (
    <li className="flex gap-2 items-center">
      <input
        type="checkbox"
        checked={done}
        onChange={toggleCompleted}
        disabled={loading}
      />
      {editing ? (
        <>
          <input
            className="border px-1"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            disabled={loading}
            onKeyDown={e => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <button
            className="text-green-600"
            onClick={saveEdit}
            disabled={loading}
            title="Save"
          >
            ✔
          </button>
          <button
            className="text-gray-500"
            onClick={() => setEditing(false)}
            disabled={loading}
            title="Cancel"
          >
            ✖
          </button>
        </>
      ) : (
        <>
          <span className={done ? "line-through" : ""}>{title}</span>
          <button
            className="text-blue-500"
            onClick={() => setEditing(true)}
            disabled={loading}
            title="Edit"
          >
            <EditIcon size={16} />
          </button>
          <button
            className="text-red-500"
            onClick={deleteTodo}
            disabled={loading}
            title="Delete"
          >
            <TrashIcon size={16} />
          </button>
        </>
      )}
    </li>
  );
}
