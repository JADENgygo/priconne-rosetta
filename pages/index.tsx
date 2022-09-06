import type { NextPage } from 'next'
import React, { useState } from 'react';

const Home: NextPage = () => {
  const [message, setMessage] = useState("");
  const [queries, setQueries] = useState([] as string[]);
  const [replies, setReplies] = useState([] as string[]);

  const ask = async (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();
    if (message.trim() === "") {
      return;
    }

    const buf = message;
    setMessage("");
    setQueries(pre => [...pre, message]);
    setReplies(pre => [...pre, "..."]);
    const r = await fetch("/api/rosetta?message=" + buf, {method: "GET", headers: {"Content-Type": "application/json"}});
    if (!r.ok) {
      setReplies(pre => pre.map((e, i) => i === pre.length - 1 ? "ぽーん、何らかの問題で正常な回答ができません": e));
      return;
    }
    const j = await r.json();
    setReplies(pre => pre.map((e, i) => i === pre.length - 1 ? j.message: e));
  };

  return (
    <div className="container">
      <p className="fs-1 text-center pt-3">プリコネロゼッタ</p>
      <p className="text-center">ロゼッタと会話ができるよ</p>
      {
        [...Array(queries.length)].map((_, i) => (
          <div key={i} className="mt-3">
            <div className="text-end mb-3">
              <span className="rounded p-1 bg-info">
                { queries[i] }
              </span>
            </div>
            <div className="text-start">
              <div className="row gx-0 gy-0">
                <div className="col-1 me-3">
                  <img src="/rosetta.webp" className="rounded-circle img-fluid" />
                </div>
                <div className="col">
                  <div className="d-flex align-items-center h-100">
                    <div>
                      <span className="rounded p-1 mt-3 bg-warning">
                        { replies[i] }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      }
      <form onSubmit={ask}>
        <label htmlFor='message' className="form-label mt-3">メッセージ</label>
        <input id="message" className="form-control" type="text" value={message} onChange={e => setMessage(e.target.value)} />
        <button type="submit" className="btn btn-dark mt-3" onSubmit={ask}>送信</button>
      </form>
    </div>
  )
}

export default Home
