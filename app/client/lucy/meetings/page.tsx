'use client'
import { useState, useEffect, useCallback } from 'react'

interface Meeting { id:string; title:string; date:string; duration:number; participants:string[]; clientName:string; summary:string; language:string }
interface MRes { meetings:Meeting[]; total:number; page:number; limit:number; pages:number }

const bg0='#09090B', bg1='#111113', bg2='#1A1A1F'
const t0='#FAFAFA', t1='#A1A1AA', t2='#71717A', t3='#52525B'
const grad='linear-gradient(135deg,#0EA5E9 0%,#A855F7 100%)'
const bdr='1px solid rgba(255,255,255,0.07)'
const KEY_RE=/^LUCY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/

function dur(s:number){if(!s)return'—';const m=Math.floor(s/60);if(m>=60){const h=Math.floor(m/60);return`${h}h${(m%60).toString().padStart(2,'0')}`}return`${m}min`}
function fmt(d:string){try{return new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(d))}catch{return d}}

export default function MeetingsPage() {
  const [key,setKey]=useState('')
  const [input,setInput]=useState('')
  const [keyErr,setKeyErr]=useState('')
  const [data,setData]=useState<MRes|null>(null)
  const [page,setPage]=useState(1)
  const [loading,setLoading]=useState(false)
  const [err,setErr]=useState('')
  const [hover,setHover]=useState<string|null>(null)

  useEffect(()=>{
    const k=localStorage.getItem('lucy_key')
    if(k) setKey(k)
  },[])

  const load=useCallback(async(k:string,p:number)=>{
    setLoading(true); setErr('')
    try{
      const r=await fetch(`/api/lucy/meetings?page=${p}&limit=20`,{headers:{'Authorization':`Bearer ${k}`}})
      if(!r.ok){const j=await r.json();throw new Error(j.error||'Erreur')}
      setData(await r.json())
    }catch(e:any){setErr(e.message)}
    finally{setLoading(false)}
  },[])

  useEffect(()=>{if(key)load(key,page)},[key,page,load])

  function submit(e:React.FormEvent){
    e.preventDefault()
    const v=input.trim().toUpperCase()
    if(!KEY_RE.test(v)){setKeyErr('Format invalide — ex: LUCY-XXXX-XXXX-XXXX');return}
    localStorage.setItem('lucy_key',v)
    setKey(v); setKeyErr('')
  }

  if(!key) return(
    <div style={{minHeight:'100vh',background:bg0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui,sans-serif'}}>
      <div style={{width:400,background:bg1,border:bdr,borderRadius:16,padding:40}}>
        <div style={{width:48,height:48,borderRadius:14,background:grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,marginBottom:20}}>🎙</div>
        <h1 style={{margin:'0 0 8px',color:t0,fontSize:22,fontWeight:700}}>Lucy — Mes réunions</h1>
        <p style={{margin:'0 0 28px',color:t2,fontSize:14}}>Entrez votre clé de licence pour accéder à votre historique.</p>
        <form onSubmit={submit}>
          <input
            value={input} onChange={e=>{setInput(e.target.value);setKeyErr('')}}
            placeholder="LUCY-XXXX-XXXX-XXXX"
            style={{width:'100%',boxSizing:'border-box',padding:'12px 14px',background:bg2,border:keyErr?'1px solid #EF4444':bdr,borderRadius:10,color:t0,fontSize:15,fontFamily:'monospace',outline:'none',marginBottom:keyErr?6:16}}
          />
          {keyErr&&<p style={{margin:'0 0 12px',color:'#EF4444',fontSize:13}}>{keyErr}</p>}
          <button type="submit" style={{width:'100%',padding:'13px',background:grad,border:'none',borderRadius:10,color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer'}}>Accéder</button>
        </form>
      </div>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:bg0,fontFamily:'system-ui,sans-serif',padding:'40px 24px'}}>
      <div style={{maxWidth:860,margin:'0 auto'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:40,height:40,borderRadius:12,background:grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🎙</div>
            <div>
              <h1 style={{margin:0,color:t0,fontSize:20,fontWeight:700}}>Mes réunions</h1>
              {data&&<p style={{margin:0,color:t2,fontSize:13}}>{data.total} réunion{data.total!==1?'s':''} enregistrée{data.total!==1?'s':''}</p>}
            </div>
          </div>
          <button onClick={()=>{localStorage.removeItem('lucy_key');setKey('');setData(null)}}
            style={{padding:'8px 14px',background:'transparent',border:bdr,borderRadius:8,color:t2,fontSize:13,cursor:'pointer'}}>
            Déconnexion
          </button>
        </div>

        {/* Error */}
        {err&&<div style={{padding:'14px 16px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,color:'#FCA5A5',fontSize:14,marginBottom:20}}>{err}</div>}

        {/* Loading skeleton */}
        {loading&&!data&&[0,1,2,3].map(i=>(
          <div key={i} style={{height:72,background:bg1,border:bdr,borderRadius:12,marginBottom:8,opacity:0.5+i*0.1}}/>
        ))}

        {/* List */}
        {data&&data.meetings.map(m=>(
          <a key={m.id} href={`/client/lucy/replay/${m.id}`}
            onMouseEnter={()=>setHover(m.id)} onMouseLeave={()=>setHover(null)}
            style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',background:bg1,
              border:hover===m.id?'1px solid rgba(14,165,233,0.35)':bdr,
              borderRadius:12,marginBottom:8,textDecoration:'none',transition:'border-color .15s'}}>
            <div style={{width:40,height:40,borderRadius:10,background:bg2,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18}}>📋</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:t0,fontWeight:600,fontSize:15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.title||'Réunion sans titre'}</div>
              <div style={{color:t2,fontSize:13,marginTop:2}}>{m.clientName&&<span style={{marginRight:10}}>👥 {m.clientName}</span>}{m.participants?.length>0&&<span>🙋 {m.participants.length} participant{m.participants.length>1?'s':''}</span>}</div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div style={{color:t1,fontSize:14,fontWeight:500}}>{dur(m.duration)}</div>
              <div style={{color:t3,fontSize:12,marginTop:2}}>{fmt(m.date)}</div>
            </div>
            <div style={{color:t3,fontSize:18,marginLeft:4}}>›</div>
          </a>
        ))}

        {/* Empty */}
        {data&&data.meetings.length===0&&(
          <div style={{textAlign:'center',padding:'60px 0',color:t2}}>
            <div style={{fontSize:40,marginBottom:16}}>🎙</div>
            <p style={{margin:0,fontSize:15}}>Aucune réunion enregistrée pour l'instant.</p>
          </div>
        )}

        {/* Pagination */}
        {data&&data.pages>1&&(
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:24}}>
            {[...Array(data.pages)].map((_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)}
                style={{width:36,height:36,borderRadius:8,border:bdr,background:page===i+1?grad:'transparent',
                  color:page===i+1?'#fff':t2,fontSize:14,cursor:'pointer',fontWeight:page===i+1?700:400}}>
                {i+1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
