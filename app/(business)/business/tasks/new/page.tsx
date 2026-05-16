"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BusinessSidebar from "@/components/BusinessSidebar";
import BusinessBottomNav from "@/components/BusinessBottomNav";

type CampaignCategory = {
  id: string;
  title: string;
  description: string;
  bestFor: string;
  icon: string;
  accent: string;
  category: string;
  missionType: "engagement" | "participation" | "premium";
};

type Package = {
  id: string;
  name: string;
  reach: string;
  description: string;
  reward: number;
  contributors: number;
  duration: string;
};

const campaignCategories: CampaignCategory[] = [
  { id: "content", title: "Content Distribution", description: "Promote flyers, announcements, videos, and posts.", bestFor: "Flyers, launch posts, announcements", icon: "/icon-content.svg", accent: "#4a9eff", category: "Content", missionType: "engagement" },
  { id: "music", title: "Music Promotion", description: "Push songs, music videos, snippets, and artist campaigns.", bestFor: "Singles, snippets, video drops", icon: "/icon-content.svg", accent: "#c084fc", category: "Music Promotion", missionType: "engagement" },
  { id: "creator", title: "Creator Campaigns", description: "Amplify creator content and social visibility.", bestFor: "Reposts, follows, social proof", icon: "/icon-profile.svg", accent: "#F5A623", category: "Creator Campaign", missionType: "engagement" },
  { id: "business", title: "Business Awareness", description: "Promote products, services, offers, and local businesses.", bestFor: "Restaurants, stores, service offers", icon: "/icon-home.svg", accent: "#1AEF22", category: "Business Awareness", missionType: "engagement" },
  { id: "apps", title: "App Testing & Reviews", description: "Get real users to test apps and provide feedback.", bestFor: "Beta tests, reviews, downloads", icon: "/icon-app-testing.svg", accent: "#38bdf8", category: "App Testing", missionType: "participation" },
  { id: "surveys", title: "Surveys & Feedback", description: "Gather opinions and customer insights.", bestFor: "Polls, product feedback, research", icon: "/icon-survey.svg", accent: "#fb7185", category: "Survey", missionType: "participation" },
  { id: "referral", title: "Referral Missions", description: "Grow through user invites and ambassador campaigns.", bestFor: "Invite drives, referral codes", icon: "/icon-task.svg", accent: "#22c55e", category: "Referral Mission", missionType: "premium" },
  { id: "event", title: "Event Promotion", description: "Spread awareness for events and gatherings.", bestFor: "Concerts, popups, campus events", icon: "/icon-alert.svg", accent: "#f97316", category: "Event Promotion", missionType: "engagement" },
  { id: "community", title: "Community Growth", description: "Grow WhatsApp, Telegram, Discord, and social communities.", bestFor: "Groups, channels, communities", icon: "/icon-profile.svg", accent: "#14b8a6", category: "Community Growth", missionType: "participation" },
  { id: "video", title: "Video Engagement", description: "Increase visibility for short-form video content.", bestFor: "TikTok, Reels, Shorts", icon: "/icon-content.svg", accent: "#e879f9", category: "Video Engagement", missionType: "engagement" },
  { id: "premium", title: "Premium Missions", description: "UGC creation, testimonials, and influencer-style participation.", bestFor: "UGC, testimonials, quality promos", icon: "/icon-wallet.svg", accent: "#facc15", category: "Premium Mission", missionType: "premium" },
];

const goals = [
  "Increase visibility",
  "Spread awareness",
  "Promote a launch",
  "Grow a community",
  "Get feedback",
  "Boost content reach",
  "Drive app downloads",
  "Encourage referrals",
  "Promote an event",
  "Generate conversations",
];

const contentTypes = ["Flyer", "Video", "Audio", "Product image", "Link"];
const actionOptions = ["Share to WhatsApp status", "Post to Facebook story", "Repost TikTok video", "Join Telegram community", "Invite friends", "Download app", "Submit feedback", "Share flyer in groups", "Use provided caption"];
const interestOptions = ["Music", "Business", "Entertainment", "Tech", "Students", "Fashion", "Gaming", "Lifestyle", "Local Communities"];
const platformOptions = ["WhatsApp", "Facebook", "TikTok", "Instagram", "Telegram", "X/Twitter", "YouTube"];
const levelOptions = ["All Contributors", "Verified Contributors", "Premium Promoters", "Community Influencers"];
const stateOptions = ["Lagos", "Abuja (FCT)", "Kano", "Rivers", "Oyo", "Kaduna", "Anambra", "Delta", "Edo", "Ogun", "Enugu", "Imo"];
const cityOptions = ["Lagos Mainland", "Lekki", "Ikeja", "Abuja Central", "Port Harcourt", "Ibadan", "Kano City", "Benin City"];
const campusOptions = ["University of Lagos", "University of Ibadan", "Covenant University", "Ahmadu Bello University", "University of Nigeria", "Yaba College of Technology"];

const packages: Package[] = [
  { id: "starter", name: "Starter Reach", reach: "Up to 100 contributors", description: "A clean test launch for local visibility.", reward: 1200, contributors: 100, duration: "3 days" },
  { id: "growth", name: "Growth Reach", reach: "Up to 500 contributors", description: "Balanced reach for offers, launches, and communities.", reward: 1500, contributors: 500, duration: "7 days" },
  { id: "viral", name: "Viral Push", reach: "Large-scale awareness", description: "Higher reward and pacing for broad participation.", reward: 2000, contributors: 1200, duration: "14 days" },
];

const steps = [
  "Promote",
  "Goal",
  "Content",
  "Mission",
  "Target",
  "Budget",
  "Preview",
  "Launch",
];

function ToggleGrid({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (next: string[]) => void }) {
  const toggle = (option: string) => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);

  return (
    <div className="toggleGrid">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button key={option} type="button" onClick={() => toggle(option)} className={active ? "pill active" : "pill"}>
            {active && <span className="checkMark">✓</span>}
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const [categoryId, setCategoryId] = useState("business");
  const [goal, setGoal] = useState("Increase visibility");
  const [contentType, setContentType] = useState("Flyer");
  const [contentLink, setContentLink] = useState("");
  const [fileName, setFileName] = useState("");
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [actions, setActions] = useState<string[]>(["Share to WhatsApp status", "Use provided caption"]);
  const [instructions, setInstructions] = useState("Leave the post visible for at least 24 hours.");
  const [interests, setInterests] = useState<string[]>(["Business", "Local Communities"]);
  const [platforms, setPlatforms] = useState<string[]>(["WhatsApp"]);
  const [levels, setLevels] = useState<string[]>(["All Contributors"]);
  const [states, setStates] = useState<string[]>(["Lagos"]);
  const [cities, setCities] = useState<string[]>([]);
  const [campuses, setCampuses] = useState<string[]>([]);
  const [packageId, setPackageId] = useState("starter");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customReward, setCustomReward] = useState("");
  const [customContributors, setCustomContributors] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [customPacing, setCustomPacing] = useState("Steady distribution");

  const category = campaignCategories.find((item) => item.id === categoryId) ?? campaignCategories[0];
  const selectedPackage = packages.find((item) => item.id === packageId) ?? packages[0];
  const resolvedReward = advancedOpen && Number(customReward) > 0 ? Number(customReward) : selectedPackage.reward;
  const resolvedContributors = advancedOpen && Number(customContributors) > 0 ? Number(customContributors) : selectedPackage.contributors;
  const resolvedDuration = advancedOpen && customDuration.trim() ? customDuration.trim() : selectedPackage.duration;
  const estimatedBudget = resolvedReward * resolvedContributors;

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/business/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.business) setBusiness(data.business);
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!title.trim()) setTitle(`${category.title} Campaign`);
  }, [category.title, title]);

  const previewInstructions = useMemo(() => {
    return [
      `Goal: ${goal}.`,
      contentType ? `Campaign content: ${contentType}${contentLink ? ` - ${contentLink}` : fileName ? ` - ${fileName}` : ""}.` : "",
      actions.length ? `Contributor actions: ${actions.join(", ")}.` : "",
      caption ? `Suggested caption: ${caption}` : "",
      instructions ? `Important instructions: ${instructions}` : "",
      `Audience: ${interests.length ? interests.join(", ") : "All interests"}.`,
      `Platforms: ${platforms.length ? platforms.join(", ") : "All platforms"}.`,
      `Contributor level: ${levels.join(", ")}.`,
      cities.length || campuses.length ? `Local focus: ${[...cities, ...campuses].join(", ")}.` : "",
      advancedOpen ? `Campaign pacing: ${customPacing}.` : "",
    ].filter(Boolean).join("\n");
  }, [actions, advancedOpen, campuses, caption, cities, contentLink, contentType, customPacing, fileName, goal, instructions, interests, levels, platforms]);

  const proofLabel = useMemo(() => {
    if (actions.some((action) => action.toLowerCase().includes("feedback"))) return "Submit your feedback and attach proof if requested";
    if (actions.some((action) => action.toLowerCase().includes("download"))) return "Upload a screenshot showing the app installed or opened";
    return "Upload a screenshot showing your post, share, or completed action";
  }, [actions]);

  const recommended = useMemo(() => {
    const recommendedPlatforms = platforms.length ? platforms.slice(0, 3).join(", ") : "WhatsApp, Instagram, TikTok";
    const quality = category.missionType === "premium" ? "high-touch participation" : category.missionType === "participation" ? "useful feedback quality" : "fast visibility";
    return { platforms: recommendedPlatforms, quality };
  }, [category.missionType, platforms]);

  const canContinue = () => {
    if (stepIndex === 0) return Boolean(categoryId);
    if (stepIndex === 1) return Boolean(goal);
    if (stepIndex === 2) return Boolean(contentType) && (contentLink.trim() || fileName || contentType !== "Link");
    if (stepIndex === 3) return Boolean(title.trim()) && actions.length > 0;
    if (stepIndex === 4) return platforms.length > 0 && levels.length > 0;
    if (stepIndex === 5) return resolvedReward >= 1000 && resolvedContributors > 0;
    return true;
  };

  const nextStep = () => {
    setError("");
    if (!canContinue()) {
      setError("Complete the highlighted choices so Qeixova can shape the campaign properly.");
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const previousStep = () => {
    setError("");
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const generateCaption = () => {
    const platformHint = platforms.length ? `on ${platforms[0]}` : "today";
    setCaption(`Discover ${title || category.title}. Join the conversation ${platformHint}, share with your circle, and help more people see what is coming from ${business?.name || "this brand"}.`);
  };

  const handleSubmit = async () => {
    if (!canContinue()) {
      setError("Review the campaign details before launch.");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      title: title.trim(),
      category: category.category,
      reward: String(resolvedReward),
      duration: resolvedDuration,
      instructions: previewInstructions,
      steps: actions,
      proof_type: actions.some((action) => action.toLowerCase().includes("feedback")) ? "text" : "screenshot",
      proof_label: proofLabel,
      max_screenshots: 2,
      task_link: contentLink.trim(),
      total_budget: String(estimatedBudget),
      target_completion_count: String(resolvedContributors),
      mission_type: category.missionType,
      verification_type: actions.some((action) => action.toLowerCase().includes("feedback")) ? "text" : "screenshot",
      difficulty: category.missionType === "premium" ? "hard" : category.missionType === "participation" ? "medium" : "easy",
      min_level: levels.includes("Premium Promoters") || levels.includes("Community Influencers") ? 2 : 1,
      target_professions: levels,
      target_interests: interests,
      target_platforms: platforms,
      target_age_ranges: [],
      target_genders: [],
      target_states: [...states, ...cities, ...campuses],
    };

    const res = await fetch("/api/business/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSuccess(true);
      setStepIndex(7);
    } else {
      setError(data.error || "Failed to launch campaign");
    }
    setSaving(false);
  };

  if (loading || !business) {
    return (
      <div className="loadingScreen">
        <div className="spinner" />
        <p>Preparing campaign builder...</p>
        <style jsx>{pageStyles}</style>
      </div>
    );
  }

  if (success) {
    return (
      <>
        <BusinessSidebar name={business.name} />
        <main className="page-body campaignPage">
          <section className="launchScreen">
            <div className="launchIcon">
              <Image src="/icon-check-circle.svg" alt="" width={34} height={34} />
            </div>
            <p className="eyebrow">Campaign ready</p>
            <h1>Your campaign is queued for growth.</h1>
            <p className="launchCopy">Qeixova will distribute it to relevant contributors based on interests, platform activity, contributor level, and location relevance.</p>
            <div className="momentumGrid">
              <div><strong>0</strong><span>early participants</span></div>
              <div><strong>Pending</strong><span>approval status</span></div>
              <div><strong>{resolvedContributors.toLocaleString()}</strong><span>estimated reach</span></div>
            </div>
            <div className="launchActions">
              <button type="button" className="secondaryButton" onClick={() => router.push("/business/tasks")}>View dashboard</button>
              <button type="button" className="primaryButton" onClick={() => router.push("/business/tasks/new")}>Create another</button>
            </div>
          </section>
        </main>
        <BusinessBottomNav />
        <style jsx>{pageStyles}</style>
      </>
    );
  }

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body campaignPage">
        <header className="campaignHeader">
          <div>
            <p className="eyebrow">Qeixova Tasks</p>
            <h1>Create Campaign</h1>
            <p>Launch a guided growth campaign in minutes.</p>
          </div>
          <div className="headerStats">
            <span>{steps.length} guided steps</span>
            <strong>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</strong>
          </div>
        </header>

        <nav className="stepper" aria-label="Campaign steps">
          {steps.map((step, index) => (
            <button key={step} type="button" onClick={() => index <= stepIndex && setStepIndex(index)} className={index === stepIndex ? "step active" : index < stepIndex ? "step done" : "step"}>
              <span>{index + 1}</span>
              {step}
            </button>
          ))}
        </nav>

        {error && <div className="errorBox">{error}</div>}

        <div className="builderShell">
          <section className="builderPanel">
            {stepIndex === 0 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 1</p>
                  <h2>What would you like to promote?</h2>
                  <p>Choose the closest campaign type. Qeixova will use this to guide rewards, proof, and targeting.</p>
                </div>
                <div className="categoryGrid">
                  {campaignCategories.map((item) => {
                    const active = item.id === categoryId;
                    return (
                      <button key={item.id} type="button" onClick={() => setCategoryId(item.id)} className={active ? "categoryCard selected" : "categoryCard"} style={{ borderColor: active ? item.accent : "#202020" }}>
                        <span className="iconBox" style={{ background: `${item.accent}18` }}>
                          <Image src={item.icon} alt="" width={22} height={22} />
                        </span>
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                        <small>Best for: {item.bestFor}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {stepIndex === 1 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 2</p>
                  <h2>What should contributors help you achieve?</h2>
                  <p>Pick the main outcome. Keep it focused so contributors understand the mission quickly.</p>
                </div>
                <div className="goalGrid">
                  {goals.map((item) => (
                    <button key={item} type="button" onClick={() => setGoal(item)} className={goal === item ? "goalButton active" : "goalButton"}>{item}</button>
                  ))}
                </div>
              </div>
            )}

            {stepIndex === 2 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 3</p>
                  <h2>Upload campaign content</h2>
                  <p>Keep the source material clear. Contributors should know exactly what to share, watch, test, or review.</p>
                </div>
                <div className="splitGrid">
                  <div className="uploadBox">
                    <Image src="/icon-content.svg" alt="" width={30} height={30} />
                    <strong>{fileName || "Drop your campaign asset here"}</strong>
                    <span>Flyer, video, audio, product image, or brief PDF. JPG, PNG, MP4, MP3, PDF supported.</span>
                    <label className="fileButton">
                      Choose file
                      <input type="file" accept="image/*,video/*,audio/*,.pdf" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
                    </label>
                  </div>
                  <div className="fieldStack">
                    <label>
                      Content type
                      <select value={contentType} onChange={(event) => setContentType(event.target.value)}>
                        {contentTypes.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </label>
                    <label>
                      Campaign link
                      <input value={contentLink} onChange={(event) => setContentLink(event.target.value)} placeholder="https://your-campaign-link.com" />
                    </label>
                    <div className="assistBox">
                      <div>
                        <strong>Need help with your caption?</strong>
                        <span>Generate a simple promotional caption from your campaign choices.</span>
                      </div>
                      <button type="button" onClick={generateCaption}>Generate</button>
                    </div>
                    <label>
                      Suggested caption
                      <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={4} placeholder="Optional caption contributors can use..." />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {stepIndex === 3 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 4</p>
                  <h2>Describe the mission</h2>
                  <p>Use structured choices first, then add only the notes that matter.</p>
                </div>
                <div className="fieldStack">
                  <label>
                    Mission title
                    <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Restaurant Awareness Campaign" />
                  </label>
                  <div>
                    <p className="labelText">What should contributors do?</p>
                    <ToggleGrid options={actionOptions} selected={actions} onChange={setActions} />
                  </div>
                  <label>
                    Important instructions
                    <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={5} placeholder="Leave post for 24 hours. Use the hashtag provided. Avoid deleting repost early." />
                  </label>
                </div>
              </div>
            )}

            {stepIndex === 4 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 5</p>
                  <h2>Choose target contributors</h2>
                  <p>Start broad, then add location or platform focus where it helps.</p>
                </div>
                <div className="targetStack">
                  <div><p className="labelText">Audience interests</p><ToggleGrid options={interestOptions} selected={interests} onChange={setInterests} /></div>
                  <div><p className="labelText">Platform selection</p><ToggleGrid options={platformOptions} selected={platforms} onChange={setPlatforms} /></div>
                  <div><p className="labelText">Contributor level</p><ToggleGrid options={levelOptions} selected={levels} onChange={setLevels} /></div>
                  <div><p className="labelText">Nigeria state targeting</p><ToggleGrid options={stateOptions} selected={states} onChange={setStates} /></div>
                  <div className="splitGrid compact">
                    <div><p className="labelText">City focus</p><ToggleGrid options={cityOptions} selected={cities} onChange={setCities} /></div>
                    <div><p className="labelText">Campus focus</p><ToggleGrid options={campusOptions} selected={campuses} onChange={setCampuses} /></div>
                  </div>
                </div>
              </div>
            )}

            {stepIndex === 5 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 6</p>
                  <h2>Budget and reward setup</h2>
                  <p>Choose a reach package. Advanced controls are available when you need exact limits.</p>
                </div>
                <div className="packageGrid">
                  {packages.map((item) => (
                    <button key={item.id} type="button" onClick={() => setPackageId(item.id)} className={packageId === item.id ? "packageCard selected" : "packageCard"}>
                      <span>{item.name}</span>
                      <strong>{item.reach}</strong>
                      <small>{item.description}</small>
                      <em>{item.reward.toLocaleString()} QLT per contributor</em>
                    </button>
                  ))}
                </div>
                <button type="button" className="advancedToggle" onClick={() => setAdvancedOpen((open) => !open)}>
                  {advancedOpen ? "Hide advanced mode" : "Customize advanced mode"}
                </button>
                {advancedOpen && (
                  <div className="advancedGrid">
                    <label>Reward per contributor<input type="number" min={1000} value={customReward} onChange={(event) => setCustomReward(event.target.value)} placeholder="1500" /></label>
                    <label>Contributor limit<input type="number" min={1} value={customContributors} onChange={(event) => setCustomContributors(event.target.value)} placeholder="500" /></label>
                    <label>Campaign duration<input value={customDuration} onChange={(event) => setCustomDuration(event.target.value)} placeholder="7 days" /></label>
                    <label>Campaign pacing<select value={customPacing} onChange={(event) => setCustomPacing(event.target.value)}><option>Steady distribution</option><option>Fast launch burst</option><option>Weekend push</option><option>Manual review first</option></select></label>
                  </div>
                )}
              </div>
            )}

            {stepIndex === 6 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 7</p>
                  <h2>Campaign preview</h2>
                  <p>This is the confidence check before launch. It mirrors what contributors need to understand.</p>
                </div>
                <PreviewCard category={category} title={title} goal={goal} reward={resolvedReward} contributors={resolvedContributors} platforms={platforms} interests={interests} instructions={previewInstructions} />
              </div>
            )}

            {stepIndex === 7 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 8</p>
                  <h2>Your campaign is ready</h2>
                  <p>Qeixova will route it to contributors by interests, platform activity, level, and location relevance.</p>
                </div>
                <div className="readyPanel">
                  <div className="readyMetric"><span>Recommended platforms</span><strong>{recommended.platforms}</strong></div>
                  <div className="readyMetric"><span>Expected quality</span><strong>{recommended.quality}</strong></div>
                  <div className="readyMetric"><span>Estimated participation</span><strong>{resolvedContributors.toLocaleString()} contributors</strong></div>
                </div>
              </div>
            )}

            <div className="wizardActions">
              <button type="button" className="secondaryButton" onClick={previousStep} disabled={stepIndex === 0}>Back</button>
              {stepIndex < 7 ? (
                <button type="button" className="primaryButton" onClick={nextStep}>Continue</button>
              ) : (
                <button type="button" className="primaryButton" disabled={saving} onClick={handleSubmit}>{saving ? "Launching..." : "Launch campaign"}</button>
              )}
            </div>
          </section>

          <aside className="summaryPanel">
            <p className="eyebrow">Live summary</p>
            <h3>{title || category.title}</h3>
            <div className="summaryIcon" style={{ background: `${category.accent}18` }}>
              <Image src={category.icon} alt="" width={26} height={26} />
            </div>
            <dl>
              <div><dt>Goal</dt><dd>{goal}</dd></div>
              <div><dt>Platforms</dt><dd>{platforms.length ? platforms.join(", ") : "All platforms"}</dd></div>
              <div><dt>Audience</dt><dd>{interests.length ? interests.join(", ") : "All interests"}</dd></div>
              <div><dt>Reward</dt><dd>{resolvedReward.toLocaleString()} QLT</dd></div>
              <div><dt>Budget</dt><dd>{estimatedBudget.toLocaleString()} QLT</dd></div>
            </dl>
          </aside>
        </div>
      </main>
      <BusinessBottomNav />
      <style jsx>{pageStyles}</style>
    </>
  );
}

function PreviewCard({ category, title, goal, reward, contributors, platforms, interests, instructions }: { category: CampaignCategory; title: string; goal: string; reward: number; contributors: number; platforms: string[]; interests: string[]; instructions: string }) {
  return (
    <article className="previewCard">
      <div className="previewTop">
        <div className="previewThumb" style={{ background: `${category.accent}18` }}>
          <Image src={category.icon} alt="" width={34} height={34} />
        </div>
        <div>
          <span>{category.title}</span>
          <h3>{title}</h3>
          <p>{goal}</p>
        </div>
      </div>
      <div className="previewStats">
        <div><strong>{reward.toLocaleString()}</strong><span>QLT reward</span></div>
        <div><strong>{contributors.toLocaleString()}</strong><span>participants</span></div>
        <div><strong>{platforms.length || "All"}</strong><span>platforms</span></div>
      </div>
      <div className="previewTags">
        {[...platforms, ...interests].slice(0, 10).map((item) => <span key={item}>{item}</span>)}
      </div>
      <pre>{instructions}</pre>
    </article>
  );
}

const pageStyles = `
  .campaignPage {
    max-width: 1180px;
    margin: 0 auto;
    color: #f5f5f5;
  }
  .loadingScreen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 14px;
    background: #050505;
    color: #aaa;
  }
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #171717;
    border-top-color: #f5a623;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .campaignHeader {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 18px;
  }
  .campaignHeader h1 {
    font-size: clamp(28px, 5vw, 42px);
    line-height: 1.05;
    letter-spacing: 0;
    margin: 4px 0 8px;
  }
  .campaignHeader p, .sectionTitle p, .launchCopy {
    color: #aaa;
    font-size: 14px;
    line-height: 1.6;
  }
  .eyebrow {
    color: #f5a623 !important;
    font-size: 11px !important;
    font-weight: 800;
    letter-spacing: 1.3px;
    text-transform: uppercase;
  }
  .headerStats {
    min-width: 132px;
    border: 1px solid #202020;
    background: #0a0a0a;
    border-radius: 14px;
    padding: 12px;
    text-align: right;
  }
  .headerStats span {
    display: block;
    color: #777;
    font-size: 11px;
    margin-bottom: 6px;
  }
  .headerStats strong {
    color: #1aef22;
    font-size: 22px;
  }
  .stepper {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 6px 0 16px;
    margin-bottom: 8px;
  }
  .step {
    border: 1px solid #202020;
    background: #0a0a0a;
    color: #777;
    border-radius: 999px;
    padding: 8px 12px 8px 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
  .step span {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #151515;
    display: grid;
    place-items: center;
    color: #999;
  }
  .step.active {
    color: #f5a623;
    border-color: rgba(245, 166, 35, 0.45);
    background: rgba(245, 166, 35, 0.08);
  }
  .step.done {
    color: #1aef22;
    border-color: rgba(26, 239, 34, 0.24);
  }
  .builderShell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 18px;
    align-items: start;
  }
  .builderPanel, .summaryPanel, .launchScreen {
    border: 1px solid #191919;
    background: #090909;
    border-radius: 20px;
  }
  .builderPanel {
    min-height: 620px;
    padding: 22px;
  }
  .summaryPanel {
    position: sticky;
    top: 24px;
    padding: 18px;
  }
  .summaryPanel h3 {
    font-size: 20px;
    line-height: 1.2;
    margin: 8px 0 14px;
  }
  .summaryIcon {
    width: 54px;
    height: 54px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    margin-bottom: 14px;
  }
  .summaryPanel dl {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .summaryPanel div {
    min-width: 0;
  }
  .summaryPanel dt {
    color: #777;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 3px;
  }
  .summaryPanel dd {
    color: #ddd;
    font-size: 13px;
    line-height: 1.45;
  }
  .sectionTitle {
    max-width: 650px;
    margin-bottom: 20px;
  }
  .sectionTitle h2 {
    font-size: clamp(24px, 4vw, 34px);
    line-height: 1.08;
    margin: 5px 0 8px;
    letter-spacing: 0;
  }
  .categoryGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 12px;
  }
  .categoryCard, .packageCard {
    text-align: left;
    border: 1px solid #202020;
    background: #0f0f0f;
    color: #f5f5f5;
    border-radius: 14px;
    padding: 15px;
    cursor: pointer;
    min-height: 164px;
    transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease;
  }
  .categoryCard:hover, .packageCard:hover {
    transform: translateY(-2px);
    background: #121212;
  }
  .categoryCard.selected, .packageCard.selected {
    background: rgba(245, 166, 35, 0.07);
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
  }
  .iconBox {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    margin-bottom: 12px;
  }
  .categoryCard strong, .packageCard strong {
    display: block;
    font-size: 15px;
    line-height: 1.25;
    margin-bottom: 7px;
  }
  .categoryCard span, .categoryCard small, .packageCard small, .packageCard em, .assistBox span {
    display: block;
    color: #aaa;
    font-size: 12px;
    line-height: 1.45;
    font-style: normal;
  }
  .categoryCard small {
    color: #777;
    margin-top: 10px;
  }
  .goalGrid, .toggleGrid, .previewTags {
    display: flex;
    gap: 9px;
    flex-wrap: wrap;
  }
  .goalButton, .pill {
    border: 1px solid #282828;
    background: #101010;
    color: #ccc;
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .goalButton.active, .pill.active {
    border-color: rgba(26, 239, 34, 0.55);
    background: rgba(26, 239, 34, 0.1);
    color: #1aef22;
  }
  .checkMark {
    margin-right: 6px;
  }
  .splitGrid {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: 16px;
  }
  .splitGrid.compact {
    grid-template-columns: 1fr 1fr;
  }
  .uploadBox {
    border: 1px dashed #333;
    background: #0f0f0f;
    border-radius: 18px;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
    padding: 26px;
  }
  .uploadBox strong {
    font-size: 17px;
  }
  .uploadBox span {
    color: #888;
    font-size: 13px;
    line-height: 1.55;
    max-width: 320px;
  }
  .fileButton {
    position: relative;
    overflow: hidden;
    border-radius: 11px;
    background: #f5a623;
    color: #000;
    padding: 10px 16px;
    font-weight: 900;
    font-size: 13px;
    cursor: pointer;
  }
  .fileButton input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .fieldStack, .targetStack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  label, .labelText {
    display: block;
    color: #ccc;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.4px;
  }
  input, select, textarea {
    width: 100%;
    margin-top: 7px;
    border: 1px solid #303030;
    background: #121212;
    color: #f5f5f5;
    border-radius: 12px;
    padding: 12px 13px;
    font-size: 14px;
    outline: none;
  }
  textarea {
    resize: vertical;
    line-height: 1.55;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #f5a623;
  }
  .assistBox {
    border: 1px solid rgba(74, 158, 255, 0.22);
    background: rgba(74, 158, 255, 0.07);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .assistBox button, .advancedToggle {
    border: 1px solid rgba(74, 158, 255, 0.36);
    background: rgba(74, 158, 255, 0.1);
    color: #7dbaff;
    border-radius: 10px;
    padding: 9px 12px;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
  }
  .packageGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .packageCard {
    min-height: 180px;
  }
  .packageCard span {
    display: inline-flex;
    color: #f5a623;
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 14px;
  }
  .packageCard strong {
    font-size: 20px;
  }
  .packageCard em {
    color: #1aef22;
    margin-top: 16px;
    font-weight: 800;
  }
  .advancedToggle {
    margin-top: 14px;
  }
  .advancedGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 14px;
    border-top: 1px solid #181818;
    padding-top: 14px;
  }
  .previewCard {
    border: 1px solid #202020;
    background: #0f0f0f;
    border-radius: 18px;
    padding: 18px;
  }
  .previewTop {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-bottom: 16px;
  }
  .previewThumb {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .previewTop span {
    color: #f5a623;
    font-size: 12px;
    font-weight: 900;
  }
  .previewTop h3 {
    margin: 4px 0;
    font-size: 22px;
  }
  .previewTop p {
    color: #aaa;
    font-size: 13px;
  }
  .previewStats, .momentumGrid, .readyPanel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }
  .previewStats div, .momentumGrid div, .readyMetric {
    border: 1px solid #1f1f1f;
    background: #090909;
    border-radius: 13px;
    padding: 12px;
  }
  .previewStats strong, .momentumGrid strong, .readyMetric strong {
    display: block;
    color: #f5f5f5;
    font-size: 18px;
    line-height: 1.15;
  }
  .previewStats span, .momentumGrid span, .readyMetric span {
    display: block;
    color: #888;
    font-size: 11px;
    margin-top: 4px;
  }
  .previewTags span {
    border-radius: 999px;
    background: rgba(245, 166, 35, 0.1);
    color: #f5a623;
    padding: 6px 9px;
    font-size: 11px;
    font-weight: 800;
  }
  .previewCard pre {
    margin-top: 16px;
    white-space: pre-wrap;
    color: #ccc;
    background: #080808;
    border: 1px solid #1a1a1a;
    border-radius: 14px;
    padding: 14px;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.6;
  }
  .readyPanel {
    margin-bottom: 0;
  }
  .wizardActions {
    border-top: 1px solid #181818;
    margin-top: 24px;
    padding-top: 18px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  .primaryButton, .secondaryButton {
    border: 0;
    border-radius: 12px;
    padding: 13px 18px;
    font-weight: 900;
    cursor: pointer;
    min-width: 130px;
  }
  .primaryButton {
    background: linear-gradient(135deg, #f5a623, #d89420);
    color: #000;
    box-shadow: 0 8px 24px rgba(245, 166, 35, 0.24);
  }
  .secondaryButton {
    background: #121212;
    border: 1px solid #292929;
    color: #ddd;
  }
  .primaryButton:disabled, .secondaryButton:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .errorBox {
    border: 1px solid rgba(229, 62, 62, 0.3);
    background: rgba(229, 62, 62, 0.1);
    color: #ff8b8b;
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 14px;
    font-size: 13px;
    font-weight: 700;
  }
  .launchScreen {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 36px 24px;
  }
  .launchIcon {
    width: 76px;
    height: 76px;
    border-radius: 22px;
    background: rgba(26, 239, 34, 0.12);
    display: grid;
    place-items: center;
    margin-bottom: 18px;
  }
  .launchScreen h1 {
    font-size: clamp(28px, 6vw, 44px);
    line-height: 1.05;
    max-width: 620px;
    margin: 8px auto 12px;
  }
  .launchCopy {
    max-width: 560px;
    margin-bottom: 22px;
  }
  .momentumGrid {
    width: min(100%, 620px);
  }
  .launchActions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  @media (max-width: 980px) {
    .builderShell {
      grid-template-columns: 1fr;
    }
    .summaryPanel {
      position: static;
      order: -1;
    }
    .packageGrid, .previewStats, .momentumGrid, .readyPanel {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 720px) {
    .campaignHeader {
      display: block;
    }
    .headerStats {
      margin-top: 14px;
      text-align: left;
    }
    .builderPanel {
      padding: 16px;
      border-radius: 16px;
      min-height: auto;
    }
    .categoryGrid, .splitGrid, .splitGrid.compact, .advancedGrid {
      grid-template-columns: 1fr;
    }
    .uploadBox {
      min-height: 240px;
    }
    .wizardActions, .launchActions {
      flex-direction: column;
    }
    .primaryButton, .secondaryButton {
      width: 100%;
    }
  }
`;
