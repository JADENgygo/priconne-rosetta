// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    res.status(405).json({});
    return;
  }
  if (req.headers["content-type"] !== "application/json") {
    res.status(401).json({});
    return;
  }

  const message = (req.query.message as string).trim();
  if (req.query.message === undefined || message === "") {
    res.status(401).json({});
    return;
  }

  const params = new URLSearchParams();
  params.append("apikey", process.env.API_KEY as string);
  params.append("query", message);
  const response = await fetch("https://api.a3rt.recruit.co.jp/talk/v1/smalltalk", {
    method: "POST",
    body: params,
  });

  if (!response.ok) {
    res.status(response.status).json({error: response.statusText});
    return;
  }

  const json = await response.json();
  if (json.status === 2000) {
    res.status(200).json({message: "ぽーん、ノーコメントです。"});
    return;
  }

  const answer = json.results[0].reply;
  res.status(200).json({ message: `ぽーん、${answer}` })
}
