"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Task {
  id: number; title: string; category: string; reward: number;
  mission_type: string; is_active: boolean; status: string;
  total_completions: number; approved_completions: number; pending_completions: number;
  created_at: string;
}

const statusCopy: Record<string, { label: string; color: string; bg: string }> = {
  pending_review: { label: "Under Review", color: "#F5A623", bg: "rgba(245,166,35,0.1)" },
  active:         { label: "Active",        color: "#1AEF22", bg: "rgba(26,239,34,0.1)" },
  paused:         { label: "Paused",        color: "#888",    bg: "rgba(255,255,255,0.05)" },
};

export default function BusinessTasksPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/business/tasks").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.tasks) setTasks(d.tasks);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch("/api/business/me").then(r => { if (!r.ok) { router.push("/business/login"); return null; } return r.json(); })
      .then(d => { if (d?.business) setBusiness(d.business); });
    load();
  }, [router]);

  const totals = useMemo(() => ({
    active:   tasks.filter(t => t.is_active).length,
    pending:  tasks.reduce((s, t) => s + t.pending_completions, 0),
    approved: tasks.reduce((s, t) => s + t.approved_completions, 0),
  }), [tasks]);

  const handleAction = async (id: number, action: string) => {
    await fetch(`/api/business/tasks/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ action }) });
    load();
  };

  if (!business) return (
    <div style={{ minHeight:"100vh", background:"#000", display:"grid", placeItems:"center" }}>
      <div style={{ width:36, height:36, border:"3px solid #1a1a1a", borderTopColor:"#F5A623", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body business-page-pro" style={{ background:"#000" }}>

        {/* Topbar */}
        <div className="businessAdsTopbar">
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
            <Image src="/icon-task.svg" alt="" width={16} height={16} style={{ opacity:0.5 }} />
            <span style={{ fontSize:13, color:"#666" }}>Campaign Manager</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Link href="/business/tasks/new" style={{ background:"linear-gradient(135deg, #F5A623, #d89420)", color:"#000", textDecoration:"none", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:800, whiteSpace:"nowrap" }}>
              + Create Campaign
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="adsPanel businessListHeader" style={{ padding:"20px 20px", marginBottom:14 }}>
          <div className="businessSectionHead" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div>
              <p style={{ color:"#F5A623", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Ads Manager</p>
              <h1 className="businessPageTitle" style={{ color:"#fff", fontSize:"clamp(22px, 4vw, 36px)", fontWeight:900, lineHeight:1.05, letterSpacing:0 }}>Campaigns</h1>
              <p style={{ color:"#bbb", fontSize:13, marginTop:6 }}>{tasks.length} campaigns · {totals.active} active · {totals.pending} pending submissions</p>
            </div>
            <Link href="/business/tasks/new" style={{ background:"linear-gradient(135deg, #F5A623, #d89420)", color:"#000", textDecoration:"none", borderRadius:11, padding:"11px 18px", fontSize:13, fontWeight:800, whiteSpace:"nowrap" }}>
              New Campaign
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="businessMetricGrid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:10, marginBottom:14 }}>
          {[
            { label:"All Campaigns",    value:tasks.length,       color:"#F5A623" },
            { label:"Active",           value:totals.active,      color:"#1AEF22" },
            { label:"Approved Actions", value:totals.approved,    color:"#1AEF22" },
            { label:"Pending Review",   value:totals.pending,     color:"#F5A623" },
          ].map(s => (
            <div key={s.label} style={{ background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:12, padding:"14px 16px" }}>
              <span style={{ color:"#bbb", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>{s.label}</span>
              <strong style={{ display:"block", color:"#F5F5F5", fontSize:24, fontWeight:900, marginTop:6 }}>{Number(s.value).toLocaleString()}</strong>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="businessCampaignTable" style={{ background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:14, overflow:"hidden" }}>
          {/* Table header */}
          <div className="businessCampaignTableHead" style={{ display:"grid", gridTemplateColumns:"minmax(200px, 1.5fr) 130px 110px 110px 160px", gap:12, padding:"12px 16px", borderBottom:"1px solid #111", color:"#555", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>
            <span>Campaign</span><span>Status</span><span>Reward</span><span>Results</span><span>Actions</span>
          </div>

          {loading ? (
            <div style={{ padding:32, color:"#bbb", fontSize:14 }}>Loading campaigns...</div>
          ) : tasks.length === 0 ? (
            <div style={{ padding:52, textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"#111", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <Image src="/icon-create-mission.svg" alt="" width={28} height={28} style={{ filter:"invert(72%) sepia(60%) saturate(500%) hue-rotate(5deg)", opacity:0.5 }} />
              </div>
              <h2 style={{ color:"#F5F5F5", fontSize:18, fontWeight:800, marginBottom:8 }}>No campaigns yet</h2>
              <p style={{ color:"#bbb", fontSize:13, margin:"0 auto 20px", maxWidth:340, lineHeight:1.6 }}>Create your first campaign and manage delivery from this workspace.</p>
              <Link href="/business/tasks/new" style={{ background:"linear-gradient(135deg, #F5A623, #d89420)", color:"#000", borderRadius:11, padding:"11px 20px", textDecoration:"none", fontWeight:800, fontSize:14 }}>
                Create Campaign
              </Link>
            </div>
          ) : (
            tasks.map((task, i) => {
              const s = task.status === "pending_review" ? statusCopy.pending_review : task.is_active ? statusCopy.active : statusCopy.paused;
              return (
                <article key={task.id} className="businessCampaignRow" style={{ display:"grid", gridTemplateColumns:"minmax(200px, 1.5fr) 130px 110px 110px 160px", gap:12, alignItems:"center", padding:"14px 16px", borderBottom:i < tasks.length-1 ? "1px solid #111" : "none" }}>
                  <div style={{ minWidth:0 }}>
                    <Link href={`/business/tasks/${task.id}`} style={{ color:"#F5F5F5", fontSize:14, fontWeight:700, textDecoration:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>{task.title}</Link>
                    <p style={{ color:"#bbb", fontSize:12, marginTop:3 }}>{task.category} · {task.mission_type ?? "engagement"}</p>
                  </div>
                  <span className="campaignStatus" style={{ justifySelf:"start", color:s.color, background:s.bg, borderRadius:20, padding:"4px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{s.label}</span>
                  <strong className="campaignReward" style={{ color:"#F5F5F5", fontSize:13, fontWeight:700 }}>{task.reward.toLocaleString()} QLT</strong>
                  <span className="campaignResults" style={{ color:"#F5F5F5", fontSize:13 }}>{task.approved_completions}/{task.total_completions}</span>
                  <div style={{ display:"flex", gap:7 }}>
                    <Link href={`/business/tasks/${task.id}`} style={{ color:"#F5F5F5", background:"#111", border:"1px solid #1a1a1a", borderRadius:9, padding:"7px 12px", textDecoration:"none", fontSize:12, fontWeight:600 }}>View</Link>
                    {task.status !== "pending_review" && (
                      <button type="button" onClick={()=>handleAction(task.id, task.is_active?"pause":"resume")} style={{ border:0, color:task.is_active?"#e53e3e":"#1AEF22", background:task.is_active?"rgba(229,62,62,0.08)":"rgba(26,239,34,0.08)", borderRadius:9, padding:"7px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        {task.is_active ? "Pause" : "Resume"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
