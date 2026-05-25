"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BusinessSidebar from "@/components/BusinessSidebar";
import BusinessBottomNav from "@/components/BusinessBottomNav";

type MissionCategory = {
  id: string;
  name: string;
  apiCategory: string;
  missionType: "engagement" | "participation" | "premium";
  description: string;
  goals: string[];
  contentLabel: string;
  contentPlaceholder: string;
  contentTypes: string[];
  defaultActions: string[];
  defaultAudience: string[];
};

type CampaignBundle = {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  platforms: string[];
  actionHint: string[];
};

type ReachPackage = {
  id: string;
  name: string;
  contributors: number;
  duration: string;
};

type Business = {
  id: number;
  name: string;
  balance: number;
};

const QLT_PER_NAIRA = 10;
const MIN_REWARD_NAIRA = 30;
const COMMISSION_RATE = 0.2;
const VERIFICATION_RATE = 0.1;

const missionCategories: MissionCategory[] = [
  {
    id: "content",
    name: "Content Distribution",
    apiCategory: "Content Distribution",
    missionType: "engagement",
    description: "Promote flyers, announcements, videos, and posts through real human distribution.",
    goals: ["Brand awareness", "Event awareness", "Product promotion", "Creator content promotion", "Local visibility"],
    contentLabel: "Content or campaign link",
    contentPlaceholder: "Paste a flyer, post, video, or landing page link",
    contentTypes: ["Flyer", "Social post", "Announcement", "Promo video", "Offer"],
    defaultActions: ["Post the campaign content", "Keep it visible for the required duration", "Submit screenshot proof"],
    defaultAudience: ["Local Promoters", "Students", "Community Influencers", "General Contributors"],
  },
  {
    id: "music",
    name: "Music Promotion",
    apiCategory: "Music Promotion",
    missionType: "engagement",
    description: "Promote songs, snippets, albums, sounds, and artist visibility.",
    goals: ["New song awareness", "Streaming awareness", "Snippet promotion", "Music video promotion", "Artist visibility"],
    contentLabel: "Song, snippet, or streaming link",
    contentPlaceholder: "Paste Spotify, Audiomack, Boomplay, Apple Music, TikTok, or YouTube link",
    contentTypes: ["Song link", "Snippet", "Cover art", "Music video", "Sound challenge"],
    defaultActions: ["Listen or view the music content", "Share the selected music asset", "Submit screenshot and short reaction"],
    defaultAudience: ["Music Supporters", "Creators", "Students", "Verified Contributors"],
  },
  {
    id: "community",
    name: "Community Growth",
    apiCategory: "Community Growth",
    missionType: "participation",
    description: "Grow Telegram, WhatsApp, Discord, and online communities with structured participation.",
    goals: ["New community launch", "Increase members", "Targeted member acquisition", "Retention campaign"],
    contentLabel: "Community invite link",
    contentPlaceholder: "Paste WhatsApp, Telegram, Discord, or Facebook Group link",
    contentTypes: ["WhatsApp community", "Telegram group", "Discord server", "Facebook group"],
    defaultActions: ["Join the community", "Read the community rules", "Submit join proof"],
    defaultAudience: ["Community Builders", "Verified Contributors", "Local Promoters", "Students"],
  },
  {
    id: "apps",
    name: "App Testing & Reviews",
    apiCategory: "App Testing",
    missionType: "participation",
    description: "Run app installs, onboarding tests, bug discovery, feature testing, and review missions.",
    goals: ["Install and open test", "Signup/onboarding test", "Bug discovery", "Feature testing", "App review"],
    contentLabel: "App or test link",
    contentPlaceholder: "Paste Play Store, App Store, web app, APK, or test instructions link",
    contentTypes: ["Android app", "iOS app", "Web app", "APK test", "Feature prototype"],
    defaultActions: ["Open or install the app", "Complete the test steps", "Submit feedback and proof"],
    defaultAudience: ["Tech Testers", "Verified Contributors", "Beta Test Participants", "Premium Contributors"],
  },
  {
    id: "feedback",
    name: "Surveys & Feedback",
    apiCategory: "Feedback Campaign",
    missionType: "participation",
    description: "Collect product feedback, opinions, content feedback, market research, and validation insights.",
    goals: ["Product feedback", "Content feedback", "Survey and opinions", "Feature validation", "Market research"],
    contentLabel: "Product, content, survey, or context link",
    contentPlaceholder: "Paste product, website, article, video, form, or research context link",
    contentTypes: ["Short survey", "Product feedback", "Content feedback", "Feature validation", "Detailed review"],
    defaultActions: ["Review the campaign context", "Answer the feedback questions", "Submit honest feedback"],
    defaultAudience: ["Verified Contributors", "Experienced Reviewers", "Students", "General Contributors"],
  },
];

const bundles: CampaignBundle[] = [
  {
    id: "story-status",
    name: "Story & Status Awareness",
    description: "WhatsApp Status, Facebook Story, and Instagram Story visibility.",
    bestFor: "flyers, event visibility, local awareness, creator awareness",
    platforms: ["WhatsApp Status", "Facebook Story", "Instagram Story"],
    actionHint: ["Post to story/status", "Keep visible for 24 hours", "Submit screenshot proof"],
  },
  {
    id: "short-video",
    name: "Short-Form Video Boost",
    description: "TikTok, Instagram Reels, and Facebook Reels participation.",
    bestFor: "viral momentum, music campaigns, creator growth, promo videos",
    platforms: ["TikTok", "Instagram Reels", "Facebook Reels"],
    actionHint: ["Watch or repost video", "Use required caption or sound", "Submit link or screenshot proof"],
  },
  {
    id: "community-distribution",
    name: "Community Distribution",
    description: "WhatsApp Groups, Telegram Communities, and Facebook Groups.",
    bestFor: "local visibility, event promotion, community awareness",
    platforms: ["WhatsApp Groups", "Telegram Communities", "Facebook Groups"],
    actionHint: ["Share to relevant community", "Respect group rules", "Submit screenshot proof"],
  },
  {
    id: "streaming-awareness",
    name: "Streaming Awareness",
    description: "Spotify, Audiomack, Boomplay, and Apple Music discovery.",
    bestFor: "music promotion, streaming awareness, artist visibility",
    platforms: ["Spotify", "Audiomack", "Boomplay", "Apple Music"],
    actionHint: ["Open streaming link", "Listen for the required time", "Submit screenshot and reaction"],
  },
  {
    id: "user-feedback",
    name: "User Feedback",
    description: "Structured feedback, opinions, testing notes, and review responses.",
    bestFor: "product testing, customer feedback, audience insights",
    platforms: ["Feedback Form", "Website", "Product Page"],
    actionHint: ["Review the context", "Answer feedback questions", "Submit response"],
  },
  {
    id: "app-growth",
    name: "App Growth",
    description: "App installs, onboarding, review, and product validation missions.",
    bestFor: "app installs, onboarding campaigns, startup growth",
    platforms: ["Android", "iOS", "Web App"],
    actionHint: ["Install or open app", "Complete onboarding/test steps", "Submit proof and feedback"],
  },
  {
    id: "community-expansion",
    name: "Community Expansion",
    description: "Grow online communities with join proof and retention rules.",
    bestFor: "Telegram growth, WhatsApp communities, audience expansion",
    platforms: ["Telegram", "WhatsApp", "Discord"],
    actionHint: ["Join the community", "Stay for required duration", "Submit join/final proof"],
  },
];

const reachPackages: ReachPackage[] = [
  { id: "starter", name: "Starter", contributors: 50, duration: "3 days" },
  { id: "growth", name: "Growth", contributors: 100, duration: "5 days" },
  { id: "momentum", name: "Momentum", contributors: 250, duration: "7 days" },
];

const steps = ["Category", "Goal", "Content", "Bundle", "Actions", "Reach", "Preview", "Launch"];

function toQlt(naira: number) {
  return Math.round(naira * QLT_PER_NAIRA);
}

function formatNaira(amount: number) {
  return `₦${Math.round(amount).toLocaleString()}`;
}

function getRewardRecommendation(categoryId: string, goal: string, bundleId: string, contentType: string) {
  const combined = `${categoryId} ${goal} ${bundleId} ${contentType}`.toLowerCase();

  if (categoryId === "apps") {
    if (combined.includes("bug") || combined.includes("feature")) return { label: "High-effort mission", naira: 300, min: 150, max: 500 };
    if (combined.includes("signup") || combined.includes("onboarding")) return { label: "High-effort mission", naira: 250, min: 150, max: 400 };
    return { label: "High-effort mission", naira: 150, min: 150, max: 400 };
  }
  if (categoryId === "feedback") {
    if (combined.includes("detailed") || combined.includes("review")) return { label: "Verified engagement mission", naira: 200, min: 80, max: 200 };
    if (combined.includes("product") || combined.includes("content") || combined.includes("feature")) return { label: "Verified engagement mission", naira: 120, min: 80, max: 150 };
    return { label: "Verified engagement mission", naira: 80, min: 80, max: 150 };
  }
  if (categoryId === "community") {
    if (combined.includes("retention")) return { label: "Verified engagement mission", naira: 120, min: 80, max: 200 };
    return { label: "Verified engagement mission", naira: 80, min: 80, max: 150 };
  }
  if (categoryId === "music") {
    if (combined.includes("video") || combined.includes("reels") || combined.includes("tiktok")) return { label: "High-effort mission", naira: 250, min: 150, max: 400 };
    if (combined.includes("stream") || combined.includes("listen")) return { label: "Verified engagement mission", naira: 100, min: 80, max: 150 };
    return { label: "Standard participation mission", naira: 50, min: 40, max: 80 };
  }
  if (combined.includes("group") || combined.includes("community")) return { label: "Standard participation mission", naira: 70, min: 40, max: 80 };
  if (combined.includes("24") || combined.includes("story") || combined.includes("status")) return { label: "Standard participation mission", naira: 50, min: 40, max: 80 };
  return { label: "Simple awareness mission", naira: MIN_REWARD_NAIRA, min: MIN_REWARD_NAIRA, max: 40 };
}

function buildPricing(rewardNaira: number, contributors: number) {
  const reward = Math.max(MIN_REWARD_NAIRA, rewardNaira);
  const contributorRewards = reward * contributors;
  const commission = Math.round(contributorRewards * COMMISSION_RATE);
  const verification = Math.round(contributorRewards * VERIFICATION_RATE);
  const total = contributorRewards + commission + verification;

  return {
    rewardNaira: reward,
    rewardQlt: toQlt(reward),
    contributorRewards,
    contributorRewardsQlt: toQlt(contributorRewards),
    commission,
    verification,
    feeTotal: commission + verification,
    total,
    totalQlt: toQlt(total),
  };
}

function requiresContentLink(categoryId: string, contentType: string) {
  const value = `${categoryId} ${contentType}`.toLowerCase();
  return ["app", "android", "ios", "web app", "apk", "song", "music", "snippet", "video", "sound"].some((term) => value.includes(term));
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [categoryId, setCategoryId] = useState("content");
  const [goal, setGoal] = useState(missionCategories[0].goals[0]);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [contentType, setContentType] = useState(missionCategories[0].contentTypes[0]);
  const [contentLink, setContentLink] = useState("");
  const [assetName, setAssetName] = useState("");
  const [bundleId, setBundleId] = useState("story-status");
  const [actions, setActions] = useState<string[]>(missionCategories[0].defaultActions);
  const [audience, setAudience] = useState<string[]>(missionCategories[0].defaultAudience.slice(0, 2));
  const [reachId, setReachId] = useState("starter");
  const [customContributors, setCustomContributors] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const category = useMemo(() => missionCategories.find((item) => item.id === categoryId) ?? missionCategories[0], [categoryId]);
  const bundle = useMemo(() => bundles.find((item) => item.id === bundleId) ?? bundles[0], [bundleId]);
  const reach = useMemo(() => reachPackages.find((item) => item.id === reachId) ?? reachPackages[0], [reachId]);
  const contributorCount = Math.max(1, Number(customContributors) || reach.contributors);
  const reward = useMemo(() => getRewardRecommendation(category.id, goal, bundle.id, contentType), [bundle.id, category.id, contentType, goal]);
  const pricing = useMemo(() => buildPricing(reward.naira, contributorCount), [contributorCount, reward.naira]);
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const linkOnlyContent = requiresContentLink(category.id, contentType);
  const hasCampaignAsset = linkOnlyContent ? contentLink.trim().length >= 3 : contentLink.trim().length >= 3 || assetName.trim().length > 0;
  const canSubmit = title.trim().length >= 4 && objective.trim().length >= 10 && hasCampaignAsset && actions.length > 0 && audience.length > 0;

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
      .catch(() => router.push("/business/login"));
  }, [router]);

  useEffect(() => {
    const nextCategory = missionCategories.find((item) => item.id === categoryId) ?? missionCategories[0];
    setGoal(nextCategory.goals[0]);
    setContentType(nextCategory.contentTypes[0]);
    setActions(nextCategory.defaultActions);
    setAudience(nextCategory.defaultAudience.slice(0, 2));
    if (nextCategory.id === "music") setBundleId("streaming-awareness");
    else if (nextCategory.id === "apps") setBundleId("app-growth");
    else if (nextCategory.id === "feedback") setBundleId("user-feedback");
    else if (nextCategory.id === "community") setBundleId("community-expansion");
    else setBundleId("story-status");
  }, [categoryId]);

  const toggleAction = (action: string) => {
    setActions((current) => current.includes(action) ? current.filter((item) => item !== action) : [...current, action]);
  };

  const nextStep = () => setStepIndex((current) => Math.min(steps.length - 1, current + 1));
  const previousStep = () => setStepIndex((current) => Math.max(0, current - 1));

  const submitCampaign = async () => {
    if (!canSubmit) {
      setError("Add a campaign title, objective, campaign link or attached asset, contributor action, and target audience before launch.");
      return;
    }

    setSaving(true);
    setError("");
    const instructions = [
      `Objective: ${objective.trim()}`,
      assetName ? `Attached asset: ${assetName}` : "",
      contentLink.trim() ? `Campaign link: ${contentLink.trim()}` : "",
      `Bundle: ${bundle.name}`,
      `Platforms: ${bundle.platforms.join(", ")}`,
      `Contributor actions: ${actions.join(" | ")}`,
      `Reward: ${pricing.rewardQlt.toLocaleString()} QLT (${formatNaira(pricing.rewardNaira)}) per approved participation.`,
      `Approval time: within 24-48 hours after proof review.`,
    ].join("\n");

    const payload = {
      title: title.trim(),
      category: category.apiCategory,
      reward: String(pricing.rewardQlt),
      duration: reach.duration,
      instructions,
      steps: actions,
      proof_type: category.id === "feedback" ? "text" : "screenshot",
      proof_label: category.id === "feedback" ? "Submit your feedback response" : "Upload proof showing you completed the mission",
      max_screenshots: 2,
      task_link: contentLink.trim() || assetName,
      total_budget: String(pricing.totalQlt),
      target_completion_count: String(contributorCount),
      mission_type: category.missionType,
      verification_type: category.id === "feedback" ? "text" : "screenshot",
      difficulty: category.missionType === "premium" ? "hard" : category.missionType === "participation" ? "medium" : "easy",
      min_level: audience.some((item) => item.includes("Premium") || item.includes("Verified")) ? 2 : 1,
      target_professions: audience,
      target_interests: [goal, contentType],
      target_platforms: bundle.platforms,
      target_age_ranges: [],
      target_genders: [],
      target_states: [],
      campaign_goal: goal,
      campaign_package: reach.name,
      campaign_metadata: {
        productBibleVersion: "participation-growth-v1",
        missionCategoryId: category.id,
        contentType,
        assetName,
        contentLink: contentLink.trim(),
        bundleId: bundle.id,
        objective,
        audience,
        pricing: {
          rewardTier: reward.label,
          rewardPerContributorNaira: pricing.rewardNaira,
          rewardPerContributorQlt: pricing.rewardQlt,
          contributorRewardsNaira: pricing.contributorRewards,
          platformCommissionNaira: pricing.commission,
          verificationFeeNaira: pricing.verification,
          totalCampaignCostNaira: pricing.total,
          totalCampaignCostQlt: pricing.totalQlt,
        },
      },
    };

    const res = await fetch("/api/business/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSuccess(true);
    } else {
      setError(data.error || "Campaign could not be launched.");
    }
    setSaving(false);
  };

  if (!business) {
    return (
      <main className="loadingShell">
        <span>Loading campaign builder...</span>
        <style jsx>{pageStyles}</style>
      </main>
    );
  }

  if (success) {
    return (
      <>
        <BusinessSidebar name={business.name} />
        <main className="successShell">
          <section className="successPanel">
            <p className="eyebrow">Campaign submitted</p>
            <h1>{title}</h1>
            <p>Your campaign has been reserved and sent into the Qeixova campaign flow. If review is required, it will go live after approval.</p>
            <div className="successActions">
              <button type="button" onClick={() => router.push("/business/tasks")}>View Campaigns</button>
              <button type="button" className="primary" onClick={() => router.push("/business/tasks/new")}>Create Another</button>
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
      <main className="pageShell">
        <section className="heroBand">
          <div>
            <p className="eyebrow">Qeixova campaign builder</p>
            <h1>Launch a participation-powered growth campaign</h1>
            <p>Choose the mission category, attach the campaign content, select a bundle, confirm contributor actions, and set reach. Qeixova calculates pricing clearly before launch.</p>
          </div>
          <div className="walletCard">
            <span>Business wallet</span>
            <strong>{business.balance.toLocaleString()} QLT</strong>
            <small>{business.name}</small>
          </div>
        </section>

        <section className="builderLayout">
          <aside className="stepRail" aria-label="Campaign steps">
            <div className="progressHeader">
              <span>Step {stepIndex + 1} of {steps.length}</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progressTrack"><span style={{ width: `${progress}%` }} /></div>
            {steps.map((step, index) => (
              <button
                key={step}
                type="button"
                className={index === stepIndex ? "step active" : index < stepIndex ? "step done" : "step"}
                onClick={() => index <= stepIndex && setStepIndex(index)}
                disabled={index > stepIndex}
              >
                <span>{index + 1}</span>
                {step}
              </button>
            ))}
          </aside>

          <section className="builderPanel">
            {stepIndex === 0 && (
              <StepSection eyebrow="Step 1" title="Select mission category" note="Start with the type of growth participation this campaign needs.">
                <div className="categoryGrid">
                  {missionCategories.map((item) => (
                    <button key={item.id} type="button" className={item.id === categoryId ? "choiceCard active" : "choiceCard"} onClick={() => setCategoryId(item.id)}>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              </StepSection>
            )}

            {stepIndex === 1 && (
              <StepSection eyebrow="Step 2" title="Select campaign goal" note="The goal controls the recommended reward, actions, and verification path.">
                <div className="goalChecklist">
                  {category.goals.map((item) => (
                    <label key={item} className={goal === item ? "goalOption active" : "goalOption"}>
                      <input
                        type="checkbox"
                        checked={goal === item}
                        onChange={() => setGoal(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <label className="fieldBlock">
                  Campaign title
                  <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Promote my new product launch" />
                </label>
                <label className="fieldBlock">
                  Campaign objective
                  <textarea value={objective} onChange={(event) => setObjective(event.target.value)} placeholder="Describe what contributors should help you achieve." />
                </label>
              </StepSection>
            )}

            {stepIndex === 2 && (
              <StepSection eyebrow="Step 3" title="Attach campaign content" note="Add the exact content contributors will promote, test, join, review, or respond to.">
                <div className="pillGrid">
                  {category.contentTypes.map((item) => (
                    <button key={item} type="button" className={contentType === item ? "pill active" : "pill"} onClick={() => setContentType(item)}>{item}</button>
                  ))}
                </div>
                {linkOnlyContent ? (
                  <div className="assetPanel linkOnlyPanel">
                    <div>
                      <p className="eyebrow">Campaign link required</p>
                      <h3>{contentType}</h3>
                      <span>For video, app, song, snippet, sound, and streaming campaigns, add a link contributors can open. File upload is not available for this content type.</span>
                    </div>
                    <div className="linkBadge">
                      <strong>Add link</strong>
                      <small>No file upload</small>
                    </div>
                  </div>
                ) : (
                  <div className="assetPanel">
                    <div>
                      <p className="eyebrow">Campaign asset</p>
                      <h3>{contentType}</h3>
                      <span>Attach a flyer, cover art, screenshot, PDF brief, document, or feedback material based on what this campaign needs. App files and videos are not accepted.</span>
                    </div>
                    <label className="uploadBox">
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(event) => setAssetName(event.target.files?.[0]?.name || "")}
                      />
                      <strong>{assetName || "Choose campaign asset"}</strong>
                      <small>Images, PDF, or document only</small>
                    </label>
                  </div>
                )}
                <label className="fieldBlock">
                  {category.contentLabel} <small>{linkOnlyContent ? "Required for this content type" : "Optional if you attached a file"}</small>
                  <input value={contentLink} onChange={(event) => setContentLink(event.target.value)} placeholder={category.contentPlaceholder} />
                </label>
              </StepSection>
            )}

            {stepIndex === 3 && (
              <StepSection eyebrow="Step 4" title="Choose recommended bundle" note="Bundles keep actions, platforms, pricing, and moderation structured.">
                <div className="bundleGrid">
                  {bundles.map((item) => (
                    <button key={item.id} type="button" className={item.id === bundleId ? "bundleCard active" : "bundleCard"} onClick={() => setBundleId(item.id)}>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                      <small>{item.platforms.join(" / ")}</small>
                    </button>
                  ))}
                </div>
              </StepSection>
            )}

            {stepIndex === 4 && (
              <StepSection eyebrow="Step 5" title="Confirm contributor actions" note="Every campaign needs clear actions so contributors understand what participation means.">
                <div className="checkGrid">
                  {[...new Set([...category.defaultActions, ...bundle.actionHint])].map((item) => (
                    <label key={item} className={actions.includes(item) ? "checkItem active" : "checkItem"}>
                      <input type="checkbox" checked={actions.includes(item)} onChange={() => toggleAction(item)} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </StepSection>
            )}

            {stepIndex === 5 && (
              <StepSection eyebrow="Step 6" title="Select reach package" note="Pricing uses contributor rewards plus 20% Qeixova commission and 10% verification fee.">
                <div className="packageGrid">
                  {reachPackages.map((item) => (
                    <button key={item.id} type="button" className={item.id === reachId ? "packageCard active" : "packageCard"} onClick={() => setReachId(item.id)}>
                      <strong>{item.name}</strong>
                      <span>{item.contributors.toLocaleString()} contributors</span>
                      <small>{item.duration}</small>
                    </button>
                  ))}
                </div>
                <label className="fieldBlock compact">
                  Custom contributor quantity
                  <input type="number" min="1" value={customContributors} onChange={(event) => setCustomContributors(event.target.value)} placeholder="Use package quantity" />
                </label>
                <PricingPanel rewardLabel={reward.label} rewardMin={reward.min} rewardMax={reward.max} contributors={contributorCount} pricing={pricing} />
              </StepSection>
            )}

            {stepIndex === 6 && (
              <StepSection eyebrow="Step 7" title="Preview campaign" note="This is what the business and contributor experience are built from.">
                <div className="previewGrid">
                  <PreviewBlock title="Business Summary" rows={[
                    ["Category", category.name],
                    ["Goal", goal],
                    ["Bundle", bundle.name],
                    ["Reach", `${contributorCount.toLocaleString()} contributors`],
                    ["Total cost", `${formatNaira(pricing.total)} (${pricing.totalQlt.toLocaleString()} QLT)`],
                  ]} />
                  <PreviewBlock title="Contributor Mission" rows={[
                    ["Reward", `${pricing.rewardQlt.toLocaleString()} QLT (${formatNaira(pricing.rewardNaira)})`],
                    ["Platforms", bundle.platforms.join(", ")],
                    ["Proof", category.id === "feedback" ? "Feedback response" : "Screenshot proof"],
                    ["Approval", "Within 24-48 hours"],
                    ["Actions", actions.join(" | ")],
                  ]} />
                </div>
              </StepSection>
            )}

            {stepIndex === 7 && (
              <StepSection eyebrow="Step 8" title="Launch campaign" note="Review the essentials, fund from wallet, then submit for review or launch.">
                <div className="launchGrid">
                  <div className="readinessPanel">
                    {[
                      ["Mission category selected", Boolean(categoryId)],
                      ["Campaign goal selected", Boolean(goal)],
                      ["Campaign title added", title.trim().length >= 4],
                      ["Campaign objective added", objective.trim().length >= 10],
                      ["Campaign content attached", hasCampaignAsset],
                      ["Contributor actions configured", actions.length > 0],
                      ["Pricing calculated", pricing.totalQlt > 0],
                    ].map(([label, ready]) => (
                      <div key={String(label)} className={ready ? "readyItem good" : "readyItem"}>
                        <span>{ready ? "OK" : "Add"}</span>
                        {label}
                      </div>
                    ))}
                  </div>
                  <PricingPanel rewardLabel={reward.label} rewardMin={reward.min} rewardMax={reward.max} contributors={contributorCount} pricing={pricing} />
                </div>
              </StepSection>
            )}

            {error && <p className="errorText">{error}</p>}

            <div className="actionsBar">
              <button type="button" className="secondaryButton" onClick={previousStep} disabled={stepIndex === 0}>Back</button>
              {stepIndex < steps.length - 1 ? (
                <button type="button" className="primaryButton" onClick={nextStep}>Continue</button>
              ) : (
                <button type="button" className="primaryButton" disabled={saving} onClick={submitCampaign}>{saving ? "Submitting..." : "Launch Campaign"}</button>
              )}
            </div>
          </section>

        </section>
      </main>
      <BusinessBottomNav />
      <style jsx>{pageStyles}</style>
    </>
  );
}

function StepSection({ eyebrow, title, note, children }: { eyebrow: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="stepSection">
      <div className="sectionHeader">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <span>{note}</span>
      </div>
      {children}
    </div>
  );
}

function PricingPanel({
  rewardLabel,
  rewardMin,
  rewardMax,
  contributors,
  pricing,
}: {
  rewardLabel: string;
  rewardMin: number;
  rewardMax: number;
  contributors: number;
  pricing: ReturnType<typeof buildPricing>;
}) {
  return (
    <div className="pricingPanel">
      <div>
        <p className="eyebrow">Pricing engine</p>
        <h3>Total Campaign Cost = Contributor Rewards x 1.3</h3>
      </div>
      <div className="pricingRows">
        <div><span>Reward tier</span><strong>{rewardLabel}</strong></div>
        <div><span>Contributors</span><strong>{contributors.toLocaleString()}</strong></div>
        <div><span>Reward each</span><strong>{pricing.rewardQlt.toLocaleString()} QLT <em>{formatNaira(pricing.rewardNaira)}</em></strong></div>
        <div><span>Allowed range</span><strong>{formatNaira(rewardMin)} - {formatNaira(rewardMax)}</strong></div>
        <div><span>Total contributor rewards</span><strong>{formatNaira(pricing.contributorRewards)}</strong></div>
        <div><span>Platform & verification fee</span><strong>{formatNaira(pricing.feeTotal)}</strong></div>
        <div className="totalRow"><span>Total campaign cost</span><strong>{formatNaira(pricing.total)}</strong></div>
      </div>
    </div>
  );
}

function PreviewBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="previewBlock">
      <h3>{title}</h3>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const pageStyles = `
  :global(body) {
    background: #070808;
    color: #f7f7f7;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .loadingShell,
  .successShell,
  .pageShell {
    min-height: 100vh;
    padding: 24px 24px 104px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, .025), transparent 340px),
      #070808;
  }

  .loadingShell {
    display: grid;
    place-items: center;
    color: #b8b8b8;
  }

  .successShell {
    display: grid;
    place-items: center;
  }

  .successPanel {
    width: min(620px, 100%);
    border: 1px solid #1b1b1b;
    background: #101111;
    border-radius: 8px;
    padding: 28px;
    box-shadow: 0 18px 60px rgba(0, 0, 0, .34);
  }

  .successPanel h1 {
    margin: 0 0 10px;
    font-size: 30px;
  }

  .successPanel p {
    color: #bdbdbd;
    line-height: 1.7;
  }

  .successActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .successActions button,
  .primaryButton,
  .secondaryButton {
    border: 0;
    border-radius: 8px;
    padding: 12px 16px;
    font-weight: 900;
    cursor: pointer;
  }

  .successActions .primary,
  .primaryButton {
    background: #f5a623;
    color: #050505;
  }

  .successActions button,
  .secondaryButton {
    background: #161616;
    color: #f8f8f8;
    border: 1px solid #252525;
  }

  .primaryButton:disabled,
  .secondaryButton:disabled {
    opacity: .45;
    cursor: not-allowed;
  }

  .heroBand {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 16px;
    align-items: start;
    margin-bottom: 18px;
    max-width: 1360px;
  }

  .heroBand > div:first-child,
  .walletCard,
  .builderPanel,
  .stepRail {
    background: #101111;
    border: 1px solid #202322;
    border-radius: 8px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, .24);
  }

  .heroBand > div:first-child {
    padding: 28px 32px;
    position: relative;
    overflow: hidden;
  }

  .heroBand h1 {
    margin: 6px 0 12px;
    max-width: 760px;
    font-size: clamp(34px, 3.1vw, 48px);
    line-height: 1.08;
    letter-spacing: 0;
  }

  .heroBand p:not(.eyebrow) {
    max-width: 740px;
    color: #bdbdbd;
    line-height: 1.65;
    margin: 0;
  }

  .walletCard {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    border-color: rgba(245, 166, 35, .28);
    background: #12100c;
    min-height: 156px;
  }

  .walletCard span,
  .walletCard small,
  .sectionHeader span,
  .choiceCard span,
  .bundleCard span,
  .bundleCard small,
  .packageCard span,
  .packageCard small {
    color: #a8a8a8;
  }

  .walletCard strong {
    font-size: 28px;
    letter-spacing: 0;
  }

  .builderLayout {
    display: grid;
    grid-template-columns: 240px minmax(560px, 1fr);
    gap: 16px;
    align-items: start;
    max-width: 1360px;
  }

  .stepRail {
    padding: 14px;
    position: sticky;
    top: 20px;
  }

  .progressHeader {
    display: flex;
    justify-content: space-between;
    color: #bdbdbd;
    font-size: 12px;
    font-weight: 800;
  }

  .progressTrack {
    height: 7px;
    background: #171717;
    border-radius: 99px;
    overflow: hidden;
    margin: 12px 0 16px;
  }

  .progressTrack span {
    display: block;
    height: 100%;
    background: #f5a623;
  }

  .step {
    width: 100%;
    border: 1px solid transparent;
    background: transparent;
    color: #a8a8a8;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 800;
    text-align: left;
  }

  .step:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .step span {
    width: 24px;
    height: 24px;
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    background: #171717;
    color: #d8d8d8;
    font-size: 12px;
  }

  .step.active {
    border-color: #f5a623;
    color: #fff;
    background: rgba(245, 166, 35, .11);
  }

  .step.done span {
    background: #1aef22;
    color: #041004;
  }

  .builderPanel {
    min-height: 660px;
    padding: 24px;
    overflow: hidden;
  }

  .stepSection {
    display: grid;
    gap: 18px;
  }

  .sectionHeader h2 {
    margin: 4px 0 8px;
    font-size: 30px;
    line-height: 1.12;
    letter-spacing: 0;
  }

  .eyebrow {
    margin: 0;
    color: #f5a623;
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .categoryGrid,
  .bundleGrid,
  .packageGrid,
  .previewGrid,
  .launchGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .choiceCard,
  .bundleCard,
  .packageCard {
    text-align: left;
    background: #0c0d0d;
    color: #f5f5f5;
    border: 1px solid #222625;
    border-radius: 8px;
    padding: 17px;
    display: grid;
    gap: 8px;
    cursor: pointer;
    min-height: 124px;
    transition: border-color .16s ease, background .16s ease, transform .16s ease;
  }

  .choiceCard strong,
  .bundleCard strong,
  .packageCard strong {
    line-height: 1.25;
  }

  .choiceCard span,
  .bundleCard span,
  .bundleCard small,
  .packageCard span,
  .packageCard small {
    line-height: 1.45;
  }

  .choiceCard:hover,
  .bundleCard:hover,
  .packageCard:hover,
  .pill:hover,
  .checkItem:hover {
    border-color: #3b3f3d;
    background: #121414;
  }

  .choiceCard.active,
  .bundleCard.active,
  .packageCard.active,
  .pill.active,
  .checkItem.active {
    border-color: #f5a623;
    background: rgba(245, 166, 35, .11);
    box-shadow: inset 0 0 0 1px rgba(245, 166, 35, .18);
  }

  .pillGrid,
  .checkGrid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .pill {
    border: 1px solid #222625;
    background: #0c0d0d;
    color: #f5f5f5;
    border-radius: 999px;
    padding: 10px 14px;
    font-weight: 850;
    cursor: pointer;
  }

  .fieldBlock {
    display: grid;
    gap: 8px;
    color: #e8e8e8;
    font-weight: 850;
  }

  .goalChecklist {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .goalOption {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 52px;
    padding: 12px 13px;
    border: 1px solid #252a28;
    border-radius: 8px;
    background: #0c0d0d;
    color: #d9d9d9;
    cursor: pointer;
    font-weight: 850;
  }

  .goalOption:hover,
  .goalOption.active {
    background: rgba(245, 166, 35, .11);
    border-color: #f5a623;
    color: #fff;
  }

  .goalOption input {
    width: 16px;
    height: 16px;
    accent-color: #f5a623;
  }

  .goalOption span {
    overflow-wrap: anywhere;
  }

  .fieldBlock small {
    color: #8f8f8f;
    font-size: 12px;
    font-weight: 700;
  }

  .fieldBlock.compact {
    max-width: 320px;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid #252a28;
    border-radius: 8px;
    background: #090a0a;
    color: #f7f7f7;
    padding: 13px 14px;
    font: inherit;
    outline: none;
  }

  input:focus,
  textarea:focus {
    border-color: rgba(245, 166, 35, .75);
    box-shadow: 0 0 0 3px rgba(245, 166, 35, .12);
  }

  textarea {
    min-height: 112px;
    resize: vertical;
  }

  .checkItem {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    border: 1px solid #222625;
    background: #0c0d0d;
    border-radius: 8px;
    padding: 12px 13px;
    cursor: pointer;
    font-weight: 800;
  }

  .checkItem input {
    width: 16px;
    height: 16px;
    accent-color: #f5a623;
  }

  .assetPanel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 14px;
    align-items: stretch;
    background: #0b0c0c;
    border: 1px solid #222625;
    border-radius: 8px;
    padding: 16px;
  }

  .assetPanel h3 {
    margin: 4px 0 8px;
    font-size: 22px;
  }

  .assetPanel span {
    display: block;
    color: #a8a8a8;
    line-height: 1.6;
  }

  .uploadBox {
    min-height: 138px;
    border: 1px dashed #4a4d49;
    border-radius: 8px;
    background: #111313;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 6px;
    padding: 16px;
    cursor: pointer;
    text-align: center;
  }

  .uploadBox input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .uploadBox strong {
    color: #f5f5f5;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .uploadBox small {
    color: #a8a8a8;
    font-weight: 700;
  }

  .linkOnlyPanel {
    grid-template-columns: minmax(0, 1fr) 180px;
  }

  .linkBadge {
    border: 1px solid #2d312f;
    border-radius: 8px;
    background: #111313;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 6px;
    padding: 16px;
    text-align: center;
  }

  .linkBadge strong {
    color: #f5a623;
    font-size: 20px;
  }

  .linkBadge small {
    color: #a8a8a8;
    font-weight: 800;
  }

  .pricingPanel,
  .previewBlock,
  .readinessPanel {
    background: #0b0c0c;
    border: 1px solid #222625;
    border-radius: 8px;
    padding: 18px;
  }

  .pricingPanel h3 {
    margin: 4px 0 16px;
    font-size: 18px;
  }

  .pricingRows {
    display: grid;
    gap: 10px;
  }

  .pricingRows div,
  .previewBlock dl div,
  .readyItem {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 10px 0;
    border-bottom: 1px solid #1b1f1d;
  }

  .pricingRows span,
  dt {
    color: #a8a8a8;
  }

  dd {
    margin: 0;
    text-align: right;
    color: #f5f5f5;
    font-weight: 800;
  }

  .pricingRows strong {
    text-align: right;
  }

  .pricingRows em {
    color: #a8a8a8;
    font-style: normal;
    margin-left: 5px;
  }

  .totalRow strong {
    color: #f5a623;
    font-size: 20px;
  }

  .previewBlock h3 {
    margin: 0 0 12px;
  }

  .readyItem {
    align-items: center;
    justify-content: flex-start;
    color: #d8d8d8;
    font-weight: 850;
  }

  .readyItem span {
    width: 42px;
    color: #f5a623;
    font-size: 12px;
  }

  .readyItem.good span {
    color: #1aef22;
  }

  .actionsBar {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 24px;
    border-top: 1px solid #1b1b1b;
    padding-top: 16px;
  }

  @media (min-width: 1720px) {
    .builderLayout {
      grid-template-columns: 240px minmax(620px, 1fr);
    }
  }

  @media (max-width: 1400px) {
    .pageShell,
    .successShell,
    .loadingShell {
      padding-left: 18px;
      padding-right: 18px;
    }

    .heroBand {
      grid-template-columns: 1fr;
    }

    .walletCard {
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
    }
  }

  .errorText {
    margin: 16px 0 0;
    border: 1px solid rgba(229, 62, 62, .4);
    background: rgba(229, 62, 62, .08);
    color: #ffb8b8;
    border-radius: 8px;
    padding: 12px;
    font-weight: 800;
  }

  @media (max-width: 1180px) {
    .pageShell,
    .successShell,
    .loadingShell {
      padding-left: 24px;
    }

    .builderLayout {
      grid-template-columns: 190px minmax(0, 1fr);
    }

  }

  @media (max-width: 820px) {
    .pageShell,
    .successShell,
    .loadingShell {
      padding: 14px 14px 104px;
    }

    .heroBand,
    .builderLayout,
    .assetPanel,
    .goalChecklist,
    .categoryGrid,
    .bundleGrid,
    .packageGrid,
    .previewGrid,
    .launchGrid {
      grid-template-columns: 1fr;
    }

    .heroBand {
      gap: 10px;
      margin-bottom: 10px;
    }

    .heroBand > div:first-child,
    .walletCard,
    .builderPanel,
    .stepRail {
      box-shadow: none;
    }

    .heroBand > div:first-child {
      padding: 16px;
    }

    .heroBand h1 {
      font-size: 25px;
      line-height: 1.08;
      margin-bottom: 8px;
    }

    .heroBand p:not(.eyebrow) {
      font-size: 13px;
      line-height: 1.48;
    }

    .walletCard {
      padding: 13px 14px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 4px 12px;
    }

    .walletCard strong {
      font-size: 22px;
      grid-row: span 2;
    }

    .walletCard small {
      grid-column: 1;
    }

    .stepRail {
      position: static;
      display: block;
      padding: 12px;
    }

    .stepRail .step {
      display: none;
    }

    .builderPanel {
      min-height: auto;
      padding: 14px;
    }

    .sectionHeader h2 {
      font-size: 22px;
    }

    .choiceCard,
    .bundleCard,
    .packageCard {
      min-height: 0;
    }

    .actionsBar {
      position: static;
      background: #0d0d0d;
      border: 1px solid #1b1b1b;
      border-radius: 8px;
      padding: 10px;
      margin-top: 18px;
    }

    .primaryButton,
    .secondaryButton {
      flex: 1;
    }
  }
`;
