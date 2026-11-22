// JEE Mission Control private sync server. Node.js 18+; no external packages.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const KEY = process.env.SYNC_KEY;
const DB = process.env.SYNC_FILE || path.join(__dirname, 'sync-data.json');
if (!KEY || KEY.length < 24) {
  console.error('Set SYNC_KEY to a random secret of at least 24 characters.');
  process.exit(1);
}
function send(res, status, data) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(data));
}
const server = http.createServer((req,res) => {
  if (req.url === '/health' && req.method === 'GET') return send(res,200,{ok:true});
  if (req.url !== '/api/state' || !['GET','PUT'].includes(req.method)) return send(res,404,{error:'Not found'});
  const auth = req.headers.authorization || '';
  const supplied = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const a = Buffer.from(supplied), b = Buffer.from(KEY);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) return send(res,401,{error:'Invalid access key'});
  if (req.method === 'GET') {
    try { if (!fs.existsSync(DB)) return send(res,200,{state:null,updatedAt:null}); return send(res,200,JSON.parse(fs.readFileSync(DB,'utf8'))); }
    catch { return send(res,500,{error:'Stored data could not be read'}); }
  }
  let raw='';
  req.on('data',chunk=>{raw+=chunk;if(raw.length>2_000_000){send(res,413,{error:'Payload too large'});req.destroy();}});
  req.on('end',()=>{
    try {
      const payload=JSON.parse(raw);
      if (!payload || typeof payload.state!=='object' || payload.state===null || Array.isArray(payload.state)) return send(res,400,{error:'Invalid state payload'});
      const record={state:payload.state,updatedAt:payload.updatedAt||new Date().toISOString()};
      fs.writeFileSync(DB,JSON.stringify(record,null,2),{mode:0o600});
      return send(res,200,{ok:true,updatedAt:record.updatedAt});
    } catch { return send(res,400,{error:'Invalid JSON'}); }
  });
});
server.listen(PORT,HOST,()=>console.log(`JEE sync server listening on ${HOST}:${PORT}`));
